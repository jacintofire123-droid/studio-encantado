import React, { useState } from 'react';
import { FAQ_ITEMS } from '../data/content';
import { BRAND_CONFIG } from '../config/brand';
import { ChevronDown, HelpCircle, Play, X, MessageCircle } from 'lucide-react';

export const FAQSection: React.FC = () => {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    'faq-1': true
  });
  const [showTutorialModal, setShowTutorialModal] = useState(false);

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <section id="faq" className="py-20 px-4 sm:px-6 relative border-t border-white/5">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-3">
            <HelpCircle className="h-5 w-5 text-amber-400" />
            <span className="text-amber-300 font-semibold text-xs uppercase tracking-wider">
              Tire Suas Dúvidas
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-black text-white">
            Perguntas <span className="text-gradient-gold">Frequentes</span>
          </h2>
          <p className="mt-2 text-sm text-slate-300">
            Respostas diretas para você ter 100% de segurança antes de presentear
          </p>
        </div>

        {/* Accordion list */}
        <div className="space-y-3">
          {FAQ_ITEMS.map((item) => {
            const isOpen = !!openItems[item.id];
            return (
              <div
                key={item.id}
                className="overflow-hidden rounded-2xl border border-white/10 bg-[#191132] transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggleItem(item.id)}
                  className="flex w-full items-center justify-between p-4 sm:p-5 text-left font-display text-sm sm:text-base font-bold text-white hover:text-amber-300 transition-colors"
                >
                  <span>{item.question}</span>
                  <ChevronDown
                    className={`h-5 w-5 text-amber-400 transition-transform duration-200 shrink-0 ml-3 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="border-t border-white/5 p-4 sm:p-5 pt-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
                    <p>{item.answer}</p>
                    {item.hasTutorial && (
                      <div className="mt-3">
                        <button
                          type="button"
                          onClick={() => setShowTutorialModal(true)}
                          className="inline-flex items-center gap-2 rounded-xl bg-amber-400/15 border border-amber-400/40 px-3.5 py-2 text-xs font-bold text-amber-300 hover:bg-amber-400/25 transition"
                        >
                          <Play className="h-3.5 w-3.5 fill-amber-300" />
                          <span>Assistir ao vídeo tutorial passo a passo</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* WhatsApp direct help */}
        <div className="mt-8 text-center">
          <p className="text-xs text-slate-400">
            Ainda com alguma dúvida específica?
          </p>
          <a
            href={`https://wa.me/${BRAND_CONFIG.whatsappNumber}?text=Ol%C3%A1!%20Tenho%20uma%20d%C3%BAvida%20sobre%20o%20${encodeURIComponent(BRAND_CONFIG.name)}.`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-2 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition"
          >
            <MessageCircle className="h-4 w-4" />
            <span>Falar com nosso atendimento humano no WhatsApp</span>
          </a>
        </div>
      </div>

      {/* Video Tutorial Modal */}
      {showTutorialModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md"
          onClick={() => setShowTutorialModal(false)}
        >
          <div
            className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-white/20 bg-black shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowTutorialModal(false)}
              className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-white hover:bg-black"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="aspect-[9/16] w-full">
              <iframe
                src="https://www.youtube.com/embed/-sP8q7qitrs?autoplay=1"
                title={`Tutorial ${BRAND_CONFIG.name}`}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
