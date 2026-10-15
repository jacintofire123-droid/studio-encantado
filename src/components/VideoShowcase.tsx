import React, { useState } from 'react';
import { Play, Sparkles } from 'lucide-react';

const SHOWCASE_ITEMS = [
  {
    id: 'homem_aranha',
    name: 'Homem-Aranha',
    youtubeId: 'm7LHi56PDW0',
    thumb: 'https://www.recadinhomagico.com.br/videos/homem_aranha/homem_aranha_festa.jpg',
    quote: '"Parabéns, campeão! Continue sendo esse garoto corajoso e obediente aos pais!"'
  },
  {
    id: 'elsa',
    name: 'Elsa Frozen',
    youtubeId: '98YsknPqQ8g',
    thumb: 'https://www.recadinhomagico.com.br/characters/elsa.webp',
    quote: '"O frio nunca incomodou, mas ver o seu sorriso aquece o coração de todo o reino!"'
  }
];

export const VideoShowcase: React.FC<{ onStartCreating: () => void }> = ({ onStartCreating }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const activeVideo = SHOWCASE_ITEMS[activeTab];

  return (
    <section id="exemplos" className="py-20 px-4 sm:px-6 relative border-t border-white/5">
      <div className="max-w-4xl mx-auto text-center">
        <span className="inline-block px-4 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-semibold mb-4">
          Veja Como Fica
        </span>
        <h2 className="text-3xl md:text-4xl font-display font-black text-white mb-3">
          Assista a um <span className="text-gradient-gold">Exemplo Completo</span>
        </h2>
        <p className="text-slate-300 text-sm max-w-xl mx-auto mb-8">
          Veja como a qualidade do áudio e da animação fazem a criança acreditar que está conversando de verdade com o personagem!
        </p>

        {/* Character Tabs */}
        <div className="flex justify-center gap-2 mb-6">
          {SHOWCASE_ITEMS.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(idx);
                setIsPlaying(false);
              }}
              className={`rounded-full border px-4 py-2 text-xs font-bold transition-all ${
                activeTab === idx
                  ? 'border-amber-400 bg-amber-400/20 text-amber-300 shadow-md'
                  : 'border-white/10 bg-white/5 text-slate-400 hover:text-white'
              }`}
            >
              Exemplo: {item.name}
            </button>
          ))}
        </div>

        {/* Video Player Box */}
        <div className="relative mx-auto aspect-video max-w-2xl overflow-hidden rounded-2xl border border-white/15 bg-black shadow-2xl">
          {isPlaying ? (
            <iframe
              src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=1&rel=0`}
              title={activeVideo.name}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="relative h-full w-full group cursor-pointer" onClick={() => setIsPlaying(true)}>
              <img
                src={activeVideo.thumb}
                alt={activeVideo.name}
                className="h-full w-full object-cover opacity-80 transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex flex-col items-center justify-center p-6 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-400 text-slate-950 shadow-2xl transition group-hover:scale-110">
                  <Play className="h-7 w-7 fill-slate-950 ml-1" />
                </div>
                <p className="mt-4 font-display text-lg font-bold text-white">
                  Toque para assistir ao vídeo do {activeVideo.name}
                </p>
                <p className="mt-1 text-xs text-amber-300/90 italic max-w-md">
                  {activeVideo.quote}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8">
          <button
            onClick={onStartCreating}
            className="btn-magic inline-flex items-center gap-2 text-sm font-bold text-slate-950"
          >
            <Sparkles className="h-4 w-4 fill-slate-950" />
            <span>Criar o Vídeo do Seu Filho Agora</span>
          </button>
        </div>
      </div>
    </section>
  );
};
