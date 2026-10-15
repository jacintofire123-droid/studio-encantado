import React from 'react';
import { Sparkles, ArrowRight, Play, User, Gift } from 'lucide-react';

export const PromoHero: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-magic-radial px-4 pb-10 pt-8 text-center border-b border-purple-500/10">
      {/* Decorative sparkles */}
      <div className="pointer-events-none absolute left-6 top-8 h-2 w-2 rounded-full bg-fuchsia-400 animate-sparkle" />
      <div
        className="pointer-events-none absolute right-10 top-16 h-3 w-3 rounded-full bg-cyan-400 animate-sparkle"
        style={{ animationDelay: '0.8s' }}
      />
      <div
        className="pointer-events-none absolute bottom-8 left-1/4 h-2 w-2 rounded-full bg-amber-400 animate-sparkle"
        style={{ animationDelay: '1.5s' }}
      />

      <div className="relative mx-auto flex max-w-3xl flex-col items-center">
        {/* Top demonstration badge */}
        <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-purple-400/40 bg-purple-500/15 px-3.5 py-1 text-xs font-bold text-purple-200 shadow-sm">
          <Sparkles className="h-3.5 w-3.5 fill-fuchsia-400 text-fuchsia-400" />
          PROMOÇÃO EXCLUSIVA DE LANÇAMENTO
        </span>

        {/* Hero headline with balanced text */}
        <h1 className="font-display text-3xl font-black leading-tight sm:text-4xl md:text-5xl text-balance">
          Surpreenda seu filho com algo que{' '}
          <span className="text-gradient-encantado">
            nenhum brinquedo, desenho ou programa
          </span>{' '}
          no mundo consegue entregar!
        </h1>

        <p className="mt-4 max-w-xl text-sm sm:text-base text-slate-300 leading-relaxed">
          O herói ou princesa favorita falando diretamente com a criança, chamando pelo nome e elogiando suas virtudes.
        </p>

        {/* 4-Step Interactive Visual Timeline */}
        <ol className="mt-8 grid w-full grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 text-left">
          {/* Step 1 */}
          <li className="relative flex flex-col items-center">
            <div className="relative w-full rounded-2xl border border-purple-400/25 bg-[#170e30]/85 p-2.5 shadow-lg backdrop-blur-sm hover:border-fuchsia-400/40 transition">
              <span className="absolute -left-2 -top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-fuchsia-500 to-purple-600 text-xs font-black text-white shadow-md">
                1
              </span>
              <div className="aspect-square rounded-xl overflow-hidden bg-black/40 p-1 flex items-center justify-center">
                <div className="grid grid-cols-2 gap-1 w-full h-full">
                  <img
                    src="https://www.recadinhomagico.com.br/videos/homem_aranha/homem_aranha_festa.jpg"
                    alt="Homem Aranha"
                    className="h-full w-full object-cover rounded"
                  />
                  <img
                    src="https://www.recadinhomagico.com.br/characters/elsa.webp"
                    alt="Elsa"
                    className="h-full w-full object-cover rounded ring-1 ring-cyan-400"
                  />
                  <img
                    src="https://www.recadinhomagico.com.br/videos/patrulha_canina/patrulha_canina_festa.jpg"
                    alt="Patrulha"
                    className="h-full w-full object-cover rounded opacity-75"
                  />
                  <img
                    src="https://www.recadinhomagico.com.br/videos/moana/moana_festa.jpg"
                    alt="Moana"
                    className="h-full w-full object-cover rounded opacity-75"
                  />
                </div>
              </div>
            </div>
            <span className="mt-2 text-center text-xs sm:text-sm font-semibold leading-tight text-white">
              Escolha o personagem
            </span>
            <ArrowRight className="absolute -right-3.5 top-[35%] hidden h-4 w-4 text-purple-400/60 sm:block" />
          </li>

          {/* Step 2 */}
          <li className="relative flex flex-col items-center">
            <div className="relative w-full rounded-2xl border border-purple-400/25 bg-[#170e30]/85 p-2.5 shadow-lg backdrop-blur-sm hover:border-purple-400/40 transition">
              <span className="absolute -left-2 -top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 text-xs font-black text-white shadow-md">
                2
              </span>
              <div className="aspect-square rounded-xl overflow-hidden bg-black/40 p-2 flex flex-col justify-center items-center text-center gap-1.5">
                <div className="h-7 w-7 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-300">
                  <User className="h-4 w-4" />
                </div>
                <div className="w-full bg-white/10 rounded px-2 py-1 text-[11px] text-fuchsia-300 font-mono font-medium truncate">
                  "Pedro Henrique"
                </div>
                <span className="text-[10px] text-slate-400">Primeiro nome</span>
              </div>
            </div>
            <span className="mt-2 text-center text-xs sm:text-sm font-semibold leading-tight text-white">
              Digite o nome
            </span>
            <ArrowRight className="absolute -right-3.5 top-[35%] hidden h-4 w-4 text-purple-400/60 sm:block" />
          </li>

          {/* Step 3 */}
          <li className="relative flex flex-col items-center">
            <div className="relative w-full rounded-2xl border border-purple-400/25 bg-[#170e30]/85 p-2.5 shadow-lg backdrop-blur-sm hover:border-cyan-400/40 transition">
              <span className="absolute -left-2 -top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 text-xs font-black text-white shadow-md">
                3
              </span>
              <div className="aspect-square rounded-xl overflow-hidden bg-black/40 p-2 flex flex-col justify-center items-center text-center relative group">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-500 flex items-center justify-center text-white shadow-md">
                  <Play className="h-5 w-5 fill-white ml-0.5" />
                </div>
                <span className="mt-2 text-[10px] font-semibold text-cyan-300">
                  Prévia em vídeo
                </span>
              </div>
            </div>
            <span className="mt-2 text-center text-xs sm:text-sm font-semibold leading-tight text-white">
              Veja a mágica
            </span>
            <ArrowRight className="absolute -right-3.5 top-[35%] hidden h-4 w-4 text-purple-400/60 sm:block" />
          </li>

          {/* Step 4 */}
          <li className="relative flex flex-col items-center">
            <div className="relative w-full rounded-2xl border border-purple-400/25 bg-[#170e30]/85 p-2.5 shadow-lg backdrop-blur-sm hover:border-emerald-400/40 transition">
              <span className="absolute -left-2 -top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 text-xs font-black text-white shadow-md">
                4
              </span>
              <div className="aspect-square rounded-xl overflow-hidden bg-black/40 p-2 flex flex-col justify-center items-center text-center">
                <div className="h-8 w-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 mb-1">
                  <Gift className="h-4 w-4" />
                </div>
                <span className="text-[10px] text-emerald-400 font-bold">Vídeo Full HD</span>
                <span className="text-[9px] text-slate-400">Em 5 min no WhatsApp</span>
              </div>
            </div>
            <span className="mt-2 text-center text-xs sm:text-sm font-semibold leading-tight text-white">
              Receba no WhatsApp
            </span>
          </li>
        </ol>
      </div>
    </section>
  );
};
