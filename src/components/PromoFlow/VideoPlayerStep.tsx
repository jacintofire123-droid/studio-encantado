import React, { useState, useRef } from 'react';
import { Character } from '../../types';
import { Play, Pause, Volume2, VolumeX, Sparkles, ArrowRight, RotateCcw, Zap } from 'lucide-react';

interface VideoPlayerStepProps {
  character: Character;
  childName: string;
  videoUrl?: string;
  isFromN8N?: boolean;
  onProceedToOffer: () => void;
}

export const VideoPlayerStep: React.FC<VideoPlayerStepProps> = ({
  character,
  childName,
  videoUrl,
  isFromN8N = false,
  onProceedToOffer
}) => {
  const activeVideoUrl = videoUrl || character.videoUrl;
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioBlocked, setAudioBlocked] = useState(false);
  const [showPersonalizedIntro, setShowPersonalizedIntro] = useState(true);

  const formatTime = (seconds: number) => {
    if (!Number.isFinite(seconds) || seconds < 0) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleStartPlayback = () => {
    const video = videoRef.current;
    if (!video) return;

    setHasStarted(true);
    setHasEnded(false);
    video.muted = false;
    const playPromise = video.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
          setAudioBlocked(false);
        })
        .catch(() => {
          // If browser blocked unmuted autoplay, try with mute or notify
          video.muted = true;
          video.play().then(() => {
            setIsPlaying(true);
            setIsMuted(true);
            setAudioBlocked(true);
          });
        });
    }
  };

  const handleTogglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (hasEnded) {
      handleReplay();
      return;
    }

    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const handleReplay = () => {
    const video = videoRef.current;
    if (!video) return;

    setHasEnded(false);
    video.currentTime = 0;
    setCurrentTime(0);
    setShowPersonalizedIntro(true);

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          setIsPlaying(false);
        });
    }
  };

  const handleToggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
    if (!video.muted) setAudioBlocked(false);
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;
    setCurrentTime(video.currentTime);
    if (video.currentTime > 5) {
      setShowPersonalizedIntro(false);
    } else {
      setShowPersonalizedIntro(true);
    }
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
    setHasEnded(true);
  };

  return (
    <div className="mx-auto w-full max-w-xl px-4 py-6">
      {/* Video Container */}
      <div className="relative aspect-[9/16] max-h-[70vh] w-full overflow-hidden rounded-3xl border border-amber-400/30 bg-black shadow-2xl mx-auto flex items-center justify-center">
        <video
          ref={videoRef}
          src={activeVideoUrl}
          playsInline
          preload="auto"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={(e) => setDuration(e.currentTarget.duration || 0)}
          onEnded={handleVideoEnded}
          onClick={hasStarted ? handleTogglePlay : undefined}
          className="h-full w-full object-contain cursor-pointer"
        />

        {/* Personalized Name Watermark Badge */}
        {hasStarted && showPersonalizedIntro && !hasEnded && (
          <div className="absolute top-4 inset-x-4 z-20 flex flex-col items-center gap-1.5 pointer-events-none animate-fadeIn">
            <div className="flex items-center gap-2 rounded-full border border-amber-400/60 bg-black/75 px-4 py-1.5 shadow-lg backdrop-blur-md">
              <Sparkles className="h-4 w-4 text-amber-300 fill-amber-300" />
              <span className="font-display text-xs sm:text-sm font-bold text-amber-300">
                Vídeo Especial para {childName}
              </span>
            </div>
            {isFromN8N && (
              <div className="flex items-center gap-1.5 rounded-full border border-emerald-400/50 bg-black/80 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300 shadow backdrop-blur-md">
                <Zap className="h-3 w-3 text-emerald-400 fill-emerald-400" />
                <span>Renderizado via n8n</span>
              </div>
            )}
          </div>
        )}

        {/* Initial Ready Overlay */}
        {!hasStarted && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/85 p-6 text-center backdrop-blur-sm">
            <div className="relative mb-5">
              <img
                src={character.image}
                alt={character.name}
                className="h-24 w-24 rounded-full object-cover ring-4 ring-amber-400/60 shadow-xl"
              />
              <span className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 border border-amber-400 text-sm">
                {character.emoji}
              </span>
            </div>

            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white text-balance">
              O recado para <span className="text-gradient-gold">{childName}</span> está pronto!
            </h2>

            <p className="mx-auto mt-3 max-w-xs text-xs sm:text-sm text-slate-300">
              Aumente o som do seu celular ou computador para ouvir cada detalhe.
            </p>

            <button
              onClick={handleStartPlayback}
              className="btn-magic mt-6 flex items-center gap-2 px-8 py-3.5 text-base font-bold text-slate-950 shadow-xl"
            >
              <Play className="h-5 w-5 fill-slate-950" />
              <span>▶ Assistir agora</span>
            </button>
          </div>
        )}

        {/* Video Ended Replay Overlay */}
        {hasEnded && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/85 p-6 text-center backdrop-blur-sm animate-fadeIn">
            <div className="relative mb-4">
              <img
                src={character.image}
                alt={character.name}
                className="h-20 w-20 rounded-full object-cover ring-4 ring-amber-400/60 shadow-xl"
              />
              <span className="absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 border border-amber-400 text-xs">
                {character.emoji}
              </span>
            </div>

            <h3 className="font-display text-xl sm:text-2xl font-bold text-white">
              Gostou do recado para <span className="text-gradient-gold">{childName}</span>?
            </h3>

            <p className="mx-auto mt-2 max-w-xs text-xs text-slate-300">
              Assista novamente quantas vezes quiser ou continue para garantir o vídeo em Full HD!
            </p>

            <div className="mt-5 flex flex-col sm:flex-row items-center gap-3 w-full max-w-xs">
              {/* Replay Button in Overlay */}
              <button
                onClick={handleReplay}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-amber-400/50 bg-amber-400/20 px-5 py-3 text-sm font-bold text-amber-300 hover:bg-amber-400/30 transition shadow-lg"
              >
                <RotateCcw className="h-4 w-4 text-amber-400" />
                <span>Assistir novamente</span>
              </button>

              {/* Proceed to Offer */}
              <button
                onClick={onProceedToOffer}
                className="btn-magic inline-flex w-full items-center justify-center gap-2 py-3 text-sm font-bold text-slate-950 shadow-xl"
              >
                <span>Pagar e Receber no WhatsApp</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Video Controls overlay when started */}
        {hasStarted && !hasEnded && (
          <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4">
            {/* Progress Bar */}
            <div className="mb-2 flex items-center gap-3">
              <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-white/20">
                <div
                  className="h-full bg-amber-400 transition-all duration-150"
                  style={{
                    width: duration ? `${(currentTime / duration) * 100}%` : '0%'
                  }}
                />
              </div>
              <span className="text-[11px] font-mono font-medium text-slate-300">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            {/* Play/Pause, Replay & Mute Bar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {/* Play / Pause Toggle */}
                <button
                  onClick={handleTogglePlay}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition"
                  aria-label={isPlaying ? 'Pausar' : 'Reproduzir'}
                  title={isPlaying ? 'Pausar' : 'Reproduzir'}
                >
                  {isPlaying ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4 fill-white ml-0.5" />
                  )}
                </button>

                {/* Replay Icon Button */}
                <button
                  onClick={handleReplay}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 hover:text-amber-300 transition"
                  aria-label="Reiniciar vídeo (Replay)"
                  title="Reiniciar vídeo do início (Replay)"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>

                {/* Mute / Unmute Toggle */}
                <button
                  onClick={handleToggleMute}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition"
                  aria-label={isMuted ? 'Ativar som' : 'Silenciar'}
                  title={isMuted ? 'Ativar som' : 'Silenciar'}
                >
                  {isMuted ? (
                    <VolumeX className="h-4 w-4 text-amber-400" />
                  ) : (
                    <Volume2 className="h-4 w-4" />
                  )}
                </button>
              </div>

              <button
                onClick={onProceedToOffer}
                className="inline-flex items-center gap-1.5 rounded-full bg-amber-400 px-3.5 py-1.5 text-xs font-bold text-slate-950 hover:bg-amber-300 transition"
              >
                <span>Garantir Vídeo</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Audio blocked notification */}
      {audioBlocked && (
        <div className="mt-3 text-center">
          <button
            onClick={handleToggleMute}
            className="text-xs text-amber-300 underline font-semibold"
          >
            🔊 Toque aqui para ativar o áudio do vídeo
          </button>
        </div>
      )}

      {/* Reassurance Message */}
      <div className="mt-5 rounded-2xl border border-amber-400/25 bg-amber-400/5 p-4 text-center">
        <p className="text-xs sm:text-sm leading-relaxed text-slate-300">
          <span className="font-semibold text-amber-300">✨ Fica tranquilo:</span> se
          o personagem tropeçar na pronúncia do nome da criança, não tem problema nenhum!
          Nossa equipe ajusta na hora pelo WhatsApp com você.
        </p>
      </div>

      {/* Action Buttons: Replay & Proceed */}
      <div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-3">
        {hasStarted && (
          <button
            type="button"
            onClick={handleReplay}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-amber-400/30 bg-amber-400/10 px-5 py-3.5 text-sm font-bold text-amber-300 hover:bg-amber-400/20 hover:border-amber-400 transition"
            aria-label="Assistir novamente (Replay)"
          >
            <RotateCcw className="h-4 w-4 text-amber-400" />
            <span>Assistir novamente (Replay)</span>
          </button>
        )}

        <button
          onClick={onProceedToOffer}
          className={`btn-magic w-full py-4 text-base font-bold text-slate-950 flex items-center justify-center gap-2 ${
            hasStarted ? 'sm:flex-1' : ''
          }`}
        >
          <span>Pagar no Pix e Receber no WhatsApp 🎁</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
