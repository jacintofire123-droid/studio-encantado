import React, { useState, useEffect, useRef } from 'react';
import { Character, MessageOccasion, getCharacterVideoForOccasion } from '../../types';
import { Sparkles, Loader2, Zap, CheckCircle2 } from 'lucide-react';
import { generateVideoWithN8N } from '../../services/n8nService';

interface GeneratingStepProps {
  character: Character;
  childName: string;
  occasion?: MessageOccasion;
  customerPhone?: string;
  onComplete: (videoUrl: string, fromN8n: boolean) => void;
}

export const GeneratingStep: React.FC<GeneratingStepProps> = ({
  character,
  childName,
  occasion = 'elogio',
  customerPhone,
  onComplete
}) => {
  const [progress, setProgress] = useState(15);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [n8nStatus, setN8nStatus] = useState<'connecting' | 'processing' | 'received'>('connecting');
  const generatedResultRef = useRef<{ videoUrl: string; fromN8n: boolean } | null>(null);
  const isCompletedRef = useRef(false);

  const generationPhases = [
    `Conectando ao workflow n8n...`,
    `Sintetizando a voz de ${character.name} no ElevenLabs para ${childName}...`,
    `Fundindo áudio e vídeo com FFmpeg (sem recarregar a tela)...`,
    `Renderizando vídeo exclusivo de ${character.name} para ${childName}...`,
    `Vídeo pronto! Carregando prévia mágica...`
  ];

  // Call n8n video generation webhook on mount
  useEffect(() => {
    let isMounted = true;

    async function triggerN8N() {
      try {
        setN8nStatus('connecting');
        const result = await generateVideoWithN8N({
          childName,
          character,
          occasion,
          customerPhone
        });

        if (!isMounted) return;

        setN8nStatus('received');
        generatedResultRef.current = {
          videoUrl: result.videoUrl,
          fromN8n: result.source === 'n8n_live'
        };
      } catch (err) {
        console.warn('Fallback at GeneratingStep:', err);
        if (isMounted) {
          generatedResultRef.current = {
            videoUrl: getCharacterVideoForOccasion(character, occasion),
            fromN8n: false
          };
        }
      }
    }

    triggerN8N();

    return () => {
      isMounted = false;
    };
  }, [childName, character, occasion, customerPhone]);

  // Smooth progress animation and phase transitions
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          if (!isCompletedRef.current) {
            isCompletedRef.current = true;
            const fallbackOccasionUrl = getCharacterVideoForOccasion(character, occasion);
            const finalUrl = generatedResultRef.current?.videoUrl || fallbackOccasionUrl;
            const isLiveN8n = generatedResultRef.current?.fromN8n || false;
            setTimeout(() => onComplete(finalUrl, isLiveN8n), 450);
          }
          return 100;
        }

        // If n8n has already responded, speed up completion smoothly
        const increment = generatedResultRef.current
          ? Math.floor(Math.random() * 15) + 12
          : Math.floor(Math.random() * 8) + 5;

        const next = Math.min(prev + increment, 100);

        // Update narrative phase based on progress
        if (next < 25) setPhaseIndex(0);
        else if (next < 50) setPhaseIndex(1);
        else if (next < 75) setPhaseIndex(2);
        else if (next < 95) setPhaseIndex(3);
        else setPhaseIndex(4);

        return next;
      });
    }, 380);

    return () => clearInterval(interval);
  }, [character.videoUrl, onComplete]);

  return (
    <div className="flex min-h-[65vh] flex-col items-center justify-center px-4 py-12 text-center">
      {/* Animated Character Avatar */}
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-amber-400/30 blur-2xl animate-pulse" />
        <img
          src={character.image}
          alt={character.name}
          className="relative h-32 w-32 sm:h-36 sm:w-36 rounded-full object-cover ring-4 ring-amber-400/70 shadow-2xl"
          onError={(e) => {
            e.currentTarget.src = 'https://www.recadinhomagico.com.br/characters/mystery-character.png';
          }}
        />
        <div className="absolute -bottom-2 -right-2 flex h-11 w-11 items-center justify-center rounded-full bg-slate-900 border-2 border-amber-400 text-amber-400 shadow-lg">
          {progress >= 100 ? (
            <CheckCircle2 className="h-6 w-6 text-emerald-400" />
          ) : (
            <Loader2 className="h-6 w-6 animate-spin" />
          )}
        </div>
      </div>

      {/* Dynamic Text */}
      <h2 className="mt-8 font-display text-2xl sm:text-3xl font-bold text-white">
        {character.name} está gravando para <span className="text-gradient-gold">{childName}</span>…
      </h2>

      <p className="mt-3 text-sm text-slate-300 font-medium h-6 transition-all duration-300">
        {generationPhases[phaseIndex]}
      </p>

      {/* Progress Bar */}
      <div className="mt-6 w-full max-w-xs">
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/10 p-0.5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 transition-all duration-300 ease-out shadow-sm"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-2 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span>Orquestração n8n</span>
          <span>{progress}%</span>
        </div>
      </div>

      {/* n8n Status & Reassurance Badge */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
        <div className="flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3.5 py-1.5 text-xs text-amber-300">
          <Zap className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
          <span>Workflow n8n: {n8nStatus === 'received' ? 'Vídeo renderizado' : 'Processando pipeline'}</span>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs text-slate-300">
          <Sparkles className="h-3.5 w-3.5 text-amber-400" />
          <span>Garantia de felicidade e encanto</span>
        </div>
      </div>
    </div>
  );
};
