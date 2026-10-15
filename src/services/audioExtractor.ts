/**
 * Utilitário de extração e recorte de áudio direto no navegador via Web Audio API.
 * Permite pegar um arquivo de vídeo (.mp4, .mov, etc.) ou URL de vídeo,
 * decodificar a trilha sonora, recortar os segundos exatos da amostra de voz
 * e gerar um arquivo .WAV compatível diretamente com o ElevenLabs Voice Cloning.
 */

function audioBufferToWav(buffer: AudioBuffer): Blob {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const format = 1; // PCM
  const bitDepth = 16;

  const bytesPerSample = bitDepth / 8;
  const blockAlign = numChannels * bytesPerSample;

  const samplesCount = buffer.length;
  const dataSize = samplesCount * blockAlign;
  const bufferLength = 44 + dataSize;
  const arrayBuffer = new ArrayBuffer(bufferLength);
  const view = new DataView(arrayBuffer);

  // Helper para escrever strings ascii
  function writeString(offset: number, str: string) {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  }

  // RIFF chunk descriptor
  writeString(0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeString(8, 'WAVE');

  // FMT sub-chunk
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true); // subchunk1size (16 for PCM)
  view.setUint16(20, format, true); // AudioFormat (1 = PCM)
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true); // byteRate
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitDepth, true);

  // DATA sub-chunk
  writeString(36, 'data');
  view.setUint32(40, dataSize, true);

  // Write audio samples interleaved
  const channels: Float32Array[] = [];
  for (let c = 0; c < numChannels; c++) {
    channels.push(buffer.getChannelData(c));
  }

  let offset = 44;
  for (let i = 0; i < samplesCount; i++) {
    for (let c = 0; c < numChannels; c++) {
      let sample = channels[c][i];
      // Clamp between -1 and 1
      sample = Math.max(-1, Math.min(1, sample));
      // Convert to 16-bit signed integer
      const intSample = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
      view.setInt16(offset, intSample, true);
      offset += 2;
    }
  }

  return new Blob([view], { type: 'audio/wav' });
}

/**
 * Recorta uma fatia temporal de um AudioBuffer
 */
function sliceAudioBuffer(
  audioCtx: AudioContext,
  originalBuffer: AudioBuffer,
  startSec: number,
  endSec: number
): AudioBuffer {
  const sampleRate = originalBuffer.sampleRate;
  const actualStartSec = Math.max(0, startSec);
  const actualEndSec = Math.min(originalBuffer.duration, endSec > actualStartSec ? endSec : originalBuffer.duration);

  const startOffset = Math.floor(actualStartSec * sampleRate);
  const endOffset = Math.floor(actualEndSec * sampleRate);
  const frameCount = Math.max(1, endOffset - startOffset);

  const slicedBuffer = audioCtx.createBuffer(
    originalBuffer.numberOfChannels,
    frameCount,
    sampleRate
  );

  for (let channel = 0; channel < originalBuffer.numberOfChannels; channel++) {
    const origData = originalBuffer.getChannelData(channel);
    const subData = origData.subarray(startOffset, endOffset);
    slicedBuffer.copyToChannel(subData, channel, 0);
  }

  return slicedBuffer;
}

/**
 * Extrai áudio de um arquivo de vídeo File selecionado no input
 */
export async function extractAudioFromVideoFile(
  file: File,
  startSec: number = 0,
  endSec: number = 0
): Promise<{ blob: Blob; duration: number; objectUrl: string }> {
  const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContextClass) {
    throw new Error('Navegador não suporta Web Audio API.');
  }

  const audioCtx = new AudioContextClass();
  try {
    const arrayBuffer = await file.arrayBuffer();
    const decodedAudio = await audioCtx.decodeAudioData(arrayBuffer);

    // Se endSec não foi fornecido ou for zero, pega até o final
    const finalEndSec = endSec > startSec ? endSec : decodedAudio.duration;
    const slicedBuffer = sliceAudioBuffer(audioCtx, decodedAudio, startSec, finalEndSec);

    const wavBlob = audioBufferToWav(slicedBuffer);
    const objectUrl = URL.createObjectURL(wavBlob);

    return {
      blob: wavBlob,
      duration: slicedBuffer.duration,
      objectUrl
    };
  } finally {
    if (audioCtx.state !== 'closed') {
      audioCtx.close().catch(() => {});
    }
  }
}

/**
 * Tenta extrair áudio de uma URL de vídeo (se CORS permitir)
 */
export async function extractAudioFromVideoUrl(
  videoUrl: string,
  startSec: number = 0,
  endSec: number = 0
): Promise<{ blob: Blob; duration: number; objectUrl: string }> {
  const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContextClass) {
    throw new Error('Navegador não suporta Web Audio API.');
  }

  const response = await fetch(videoUrl, { mode: 'cors' });
  if (!response.ok) {
    throw new Error(`Falha ao baixar vídeo (${response.status}): ${response.statusText}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const audioCtx = new AudioContextClass();
  try {
    const decodedAudio = await audioCtx.decodeAudioData(arrayBuffer);
    const finalEndSec = endSec > startSec ? endSec : decodedAudio.duration;
    const slicedBuffer = sliceAudioBuffer(audioCtx, decodedAudio, startSec, finalEndSec);

    const wavBlob = audioBufferToWav(slicedBuffer);
    const objectUrl = URL.createObjectURL(wavBlob);

    return {
      blob: wavBlob,
      duration: slicedBuffer.duration,
      objectUrl
    };
  } finally {
    if (audioCtx.state !== 'closed') {
      audioCtx.close().catch(() => {});
    }
  }
}
