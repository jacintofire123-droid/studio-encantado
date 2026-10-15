import React from 'react';
import { HOW_IT_WORKS_STEPS } from '../data/content';
import { BRAND_CONFIG } from '../config/brand';
import { Sparkles, ArrowRight } from 'lucide-react';

export const HowItWorks: React.FC<{ onStartCreating: () => void }> = ({ onStartCreating }) => {
  return (
    <section id="como-funciona" className="py-20 px-4 sm:px-6 relative border-t border-white/5">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-3">
            Passo a Passo
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-black text-white">
            Como Funciona o <span className="text-gradient-gold">{BRAND_CONFIG.name}</span>?
          </h2>
          <p className="mt-2 text-sm text-slate-300 max-w-xl mx-auto">
            Sem burocracia ou esperas de dias: em poucos cliques a mágica acontece na palma da sua mão.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {HOW_IT_WORKS_STEPS.map((step) => (
            <div
              key={step.number}
              className="glass-card p-6 rounded-2xl relative flex flex-col justify-between border border-white/10 hover:border-amber-400/40 transition-all hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">{step.emoji}</span>
                  <span className="font-display text-2xl font-black text-amber-400/80 font-mono">
                    0{step.number}
                  </span>
                </div>
                <h3 className="font-display text-lg font-bold text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <button
            onClick={onStartCreating}
            className="btn-magic inline-flex items-center gap-2 text-sm font-bold text-slate-950"
          >
            <Sparkles className="h-4 w-4 fill-slate-950" />
            <span>Começar Agora com Desconto Promocional</span>
          </button>
        </div>
      </div>
    </section>
  );
};
