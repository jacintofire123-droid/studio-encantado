import React, { useState } from 'react';
import { VIDEO_REACTIONS, PRINT_TESTIMONIALS } from '../data/content';
import { Heart, ChevronLeft, ChevronRight, X, ZoomIn, Star, MessageSquare } from 'lucide-react';

export const SocialProof: React.FC = () => {
  const [activeReactionIdx, setActiveReactionIdx] = useState(0);
  const [activePrintIdx, setActivePrintIdx] = useState(0);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  const currentReaction = VIDEO_REACTIONS[activeReactionIdx];

  const nextReaction = () => {
    setActiveReactionIdx((prev) => (prev + 1) % VIDEO_REACTIONS.length);
  };

  const prevReaction = () => {
    setActiveReactionIdx((prev) => (prev - 1 + VIDEO_REACTIONS.length) % VIDEO_REACTIONS.length);
  };

  return (
    <section className="mt-14 w-full">
      {/* Real Reactions Section */}
      <div className="mb-6 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-3.5 py-1 text-xs font-semibold text-amber-300">
          <Heart className="h-3.5 w-3.5 fill-amber-300 text-amber-300" />
          Reações Reais
        </span>
        <h2 className="mt-3 font-display text-2xl sm:text-3xl font-black text-white">
          O brilho nos olhos que <span className="text-gradient-gold">não tem preço.</span>
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-slate-300">
          Veja a surpresa genuína das crianças ao escutarem seu nome falado pelo ídolo
        </p>
      </div>

      {/* YouTube Shorts Video Reaction Frame */}
      <div className="relative mx-auto aspect-[9/16] max-w-[300px] sm:max-w-[320px] overflow-hidden rounded-2xl border border-white/15 bg-black shadow-2xl">
        <iframe
          key={currentReaction.youtubeId}
          src={`https://www.youtube.com/embed/${currentReaction.youtubeId}?rel=0&modestbranding=1`}
          title={currentReaction.label}
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      {/* Video Carousel Controls */}
      <div className="mt-4 flex items-center justify-center gap-4">
        <button
          onClick={prevReaction}
          aria-label="Reação anterior"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white hover:bg-amber-400/20 hover:border-amber-400/50 transition"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div className="flex gap-2">
          {VIDEO_REACTIONS.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => setActiveReactionIdx(idx)}
              aria-label={`Ver reação ${idx + 1}`}
              className={`h-2.5 rounded-full transition-all ${
                activeReactionIdx === idx
                  ? 'w-7 bg-amber-400'
                  : 'w-2.5 bg-white/20 hover:bg-white/40'
              }`}
            />
          ))}
        </div>

        <button
          onClick={nextReaction}
          aria-label="Próxima reação"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white hover:bg-amber-400/20 hover:border-amber-400/50 transition"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <p className="mt-2 text-center text-xs font-medium text-amber-300/80">
        {currentReaction.label}
      </p>

      {/* WhatsApp Feedback Gallery */}
      <div className="mt-14">
        <div className="mb-6 text-center">
          <div className="flex items-center justify-center gap-1 text-amber-400 mb-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <h3 className="font-display text-xl sm:text-2xl font-bold text-white">
            Mensagens que recebemos no WhatsApp
          </h3>
          <p className="mt-1 text-xs text-slate-300">
            Relatos de mães, pais e padrinhos que viveram esse momento inesquecível
          </p>
        </div>

        {/* Horizontal Scroll of WhatsApp Prints */}
        <div className="flex gap-3 overflow-x-auto pb-4 pt-1 snap-x scrollbar-thin">
          {PRINT_TESTIMONIALS.map((print) => (
            <div
              key={print.id}
              onClick={() => setZoomedImage(print.imageUrl)}
              className="group relative shrink-0 w-60 sm:w-64 cursor-pointer overflow-hidden rounded-2xl border border-white/15 bg-[#181130] p-2 shadow-lg transition-all hover:border-amber-400/50 hover:scale-[1.02] snap-center"
            >
              <img
                src={print.imageUrl}
                alt={print.alt}
                loading="lazy"
                className="w-full rounded-xl object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100 rounded-2xl">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-900/90 px-3 py-1.5 text-xs font-semibold text-white shadow">
                  <ZoomIn className="h-3.5 w-3.5 text-amber-400" />
                  Ver relato ampliado
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {zoomedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
          onClick={() => setZoomedImage(null)}
        >
          <div className="relative max-h-[90vh] max-w-lg overflow-hidden rounded-2xl bg-[#1e1438] p-3 shadow-2xl">
            <button
              onClick={() => setZoomedImage(null)}
              className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-white hover:bg-black"
            >
              <X className="h-5 w-5" />
            </button>
            <img
              src={zoomedImage}
              alt="Depoimento ampliado"
              className="max-h-[85vh] w-auto rounded-xl object-contain mx-auto"
            />
          </div>
        </div>
      )}
    </section>
  );
};
