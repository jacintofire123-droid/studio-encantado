const ELEVENLABS_STORAGE_KEY = 'studio_encantado_elevenlabs_config';

export interface ElevenLabsConfig {
  apiKey: string;
  defaultModel: string;
  defaultStability: number;
  defaultSimilarity: number;
}

export const DEFAULT_ELEVENLABS_CONFIG: ElevenLabsConfig = {
  apiKey: '',
  defaultModel: 'eleven_multilingual_v2',
  defaultStability: 0.5,
  defaultSimilarity: 0.85
};

export const getStoredElevenLabsConfig = (): ElevenLabsConfig => {
  try {
    const raw = localStorage.getItem(ELEVENLABS_STORAGE_KEY);
    return raw ? { ...DEFAULT_ELEVENLABS_CONFIG, ...JSON.parse(raw) } : DEFAULT_ELEVENLABS_CONFIG;
  } catch {
    return DEFAULT_ELEVENLABS_CONFIG;
  }
};

export const saveStoredElevenLabsConfig = (config: ElevenLabsConfig): void => {
  try {
    localStorage.setItem(ELEVENLABS_STORAGE_KEY, JSON.stringify(config));
  } catch (e) {
    console.error('Erro ao salvar config do ElevenLabs:', e);
  }
};

/**
 * Clona uma voz automaticamente no ElevenLabs via API oficial
 * POST https://api.elevenlabs.io/v1/voices/add
 */
export const cloneVoiceElevenLabs = async (
  apiKey: string,
  characterName: string,
  audioBlobOrFile: Blob | File,
  description?: string
): Promise<{ success: boolean; voiceId?: string; error?: string }> => {
  if (!apiKey || apiKey.trim() === '') {
    return { success: false, error: 'Chave de API do ElevenLabs (xi-api-key) não fornecida.' };
  }

  try {
    const formData = new FormData();
    formData.append('name', `${characterName} - Estúdio Encantado`);
    formData.append('description', description || `Voz do personagem ${characterName} para vídeos personalizados de aniversário.`);
    formData.append('files', audioBlobOrFile, `${characterName.toLowerCase().replace(/\s+/g, '_')}_amostra.mp3`);

    const response = await fetch('https://api.elevenlabs.io/v1/voices/add', {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey.trim()
      },
      body: formData
    });

    if (!response.ok) {
      const errText = await response.text();
      let parsedMsg = errText;
      try {
        const json = JSON.parse(errText);
        parsedMsg = json.detail?.message || json.message || errText;
      } catch {
        // use raw
      }
      return { success: false, error: `Erro ElevenLabs (${response.status}): ${parsedMsg}` };
    }

    const data = await response.json();
    return {
      success: true,
      voiceId: data.voice_id
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Falha de conexão com a API do ElevenLabs.'
    };
  }
};

/**
 * Gera um trecho de áudio rápido de teste para ouvir a voz clonada
 */
export const testGenerateTTS = async (
  apiKey: string,
  voiceId: string,
  text: string
): Promise<{ success: boolean; audioUrl?: string; error?: string }> => {
  if (!apiKey || !voiceId) {
    return { success: false, error: 'API Key ou Voice ID faltando.' };
  }

  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey.trim(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.85,
          style: 0.15,
          use_speaker_boost: true
        }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      return { success: false, error: `Erro ao gerar fala (${response.status}): ${errText}` };
    }

    const blob = await response.blob();
    const audioUrl = URL.createObjectURL(blob);
    return { success: true, audioUrl };
  } catch (err: any) {
    return { success: false, error: err.message || 'Erro ao comunicar com ElevenLabs TTS.' };
  }
};
