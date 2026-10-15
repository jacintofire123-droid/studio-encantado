import React, { useState, useEffect } from 'react';
import { PRICING_PLANS } from '../data/content';
import { Sparkles, Check } from 'lucide-react';
import {
  getStoredPricing,
  formatCurrency,
  formatInstallment
} from '../services/adminStore';

export const PricingSection: React.FC<{ onSelectPlan: (planId: '1-video' | '2-videos') => void }> = ({
  onSelectPlan
}) => {
  const [pricing, setPricing] = useState(getStoredPricing());

  useEffect(() => {
    const handlePriceUpdate = () => setPricing(getStoredPricing());
    window.addEventListener('studio_pricing_updated', handlePriceUpdate);
    return () => window.removeEventListener('studio_pricing_updated', handlePriceUpdate);
  }, []);

  return (
    <section id="preco" className="py-20 px-4 sm:px-6 relative border-t border-white/5">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-semibold mb-3">
            Planos & Preços
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-black text-white">
            Uma <span className="text-gradient-gold">Lembrança Eterna</span> que cabe no bolso
          </h2>
          <p className="mt-2 text-sm text-slate-300 max-w-lg mx-auto">
            Escolha a melhor opção para presentear seu filho ou surpreender irmãos e primos
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {PRICING_PLANS.map((plan) => {
            const originalPriceDisplay =
              plan.id === '1-video'
                ? formatCurrency(pricing.singleVideoOriginalPrice)
                : formatCurrency(pricing.comboVideoOriginalPrice);

            const cashPriceDisplay =
              plan.id === '1-video'
                ? formatCurrency(pricing.singleVideoPrice)
                : formatCurrency(pricing.comboVideoPrice);

            const installmentDisplay =
              plan.id === '1-video'
                ? formatInstallment(pricing.singleVideoPrice, pricing.singleVideoInstallments)
                : formatInstallment(pricing.comboVideoPrice, pricing.comboVideoInstallments);

            return (
              <div
                key={plan.id}
                className={`rounded-3xl p-6 sm:p-8 relative flex flex-col justify-between transition-all ${
                  plan.highlighted
                    ? 'border-2 border-amber-400 bg-[#221742] shadow-2xl shadow-amber-500/20 md:-translate-y-2'
                    : 'border border-white/15 bg-[#17102e] hover:border-white/30'
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 px-4 py-1 text-[11px] font-black uppercase tracking-wider text-slate-950 shadow-md">
                    Mais Escolhido pelas Mães
                  </div>
                )}

                <div>
                  <h3 className="font-display text-xl font-bold text-white mb-1">
                    {plan.name}
                  </h3>
                  <p className="text-xs text-slate-400 mb-6">{plan.subtitle}</p>

                  <div className="mb-6">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs text-slate-400 line-through">
                        {originalPriceDisplay}
                      </span>
                      <span className="text-3xl font-display font-black text-gradient-gold">
                        {cashPriceDisplay}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1 font-medium">
                      Ou em até <strong className="text-white">{installmentDisplay}</strong> no cartão
                    </p>
                  </div>

                  <div className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs sm:text-sm text-slate-200">
                        <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectPlan(plan.id)}
                  className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition ${
                    plan.highlighted
                      ? 'btn-magic text-slate-950 shadow-lg'
                      : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
                  }`}
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Escolher {plan.name}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
