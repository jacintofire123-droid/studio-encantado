import React, { useState } from 'react';
import { Shield, ShieldCheck, Heart, Lock } from 'lucide-react';
import { BRAND_CONFIG } from '../config/brand';
import { StudioEncantadoLogo } from './StudioEncantadoLogo';
import { TermsModal } from './TermsModal';

interface FooterProps {
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [termsTab, setTermsTab] = useState<'termos' | 'privacidade'>('termos');
  const [secretClicks, setSecretClicks] = useState(0);

  const openTerms = (tab: 'termos' | 'privacidade') => {
    setTermsTab(tab);
    setShowTermsModal(true);
  };

  const handleSecretClick = () => {
    if (!onOpenAdmin) return;
    const nextClicks = secretClicks + 1;
    if (nextClicks >= 5) {
      setSecretClicks(0);
      onOpenAdmin();
    } else {
      setSecretClicks(nextClicks);
      // Reset after 3 seconds of inactivity
      setTimeout(() => setSecretClicks(0), 3000);
    }
  };

  return (
    <footer className="w-full border-t border-white/5 bg-[#0e091e] py-8 px-4 text-center text-slate-400">
      <div className="max-w-4xl mx-auto flex flex-col items-center gap-4">
        {/* Studio Encantado Brand Mark */}
        <StudioEncantadoLogo size="sm" />

        {/* Quiet Nav Links */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400">
          <a
            href={`https://wa.me/${BRAND_CONFIG.whatsappNumber}?text=Ol%C3%A1!%20Preciso%20de%20ajuda%20com%20o%20${encodeURIComponent(BRAND_CONFIG.name)}.`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-amber-400 transition-colors"
          >
            Suporte WhatsApp
          </a>
          <span className="text-slate-700">·</span>
          <button
            type="button"
            onClick={() => openTerms('termos')}
            className="hover:text-amber-400 cursor-pointer transition-colors"
          >
            Termos de Uso & API WhatsApp
          </button>
          <span className="text-slate-700">·</span>
          <button
            type="button"
            onClick={() => openTerms('privacidade')}
            className="hover:text-amber-400 cursor-pointer transition-colors"
          >
            Privacidade & LGPD
          </button>
          <span className="text-slate-700">·</span>
          <span className="inline-flex items-center gap-1 text-emerald-400">
            <Shield className="h-3 w-3" />
            Garantia 7 Dias
          </span>
          <span className="text-slate-700">·</span>
          <button
            type="button"
            onClick={onOpenAdmin}
            className="text-slate-400 hover:text-amber-400 cursor-pointer transition-colors underline decoration-slate-700 hover:decoration-amber-400"
          >
            Acesso Lojista (Admin)
          </button>
        </div>

        {/* Site Seguro & Verificado Trust Seal */}
        <div className="my-1 inline-flex flex-wrap items-center justify-center gap-3 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs text-emerald-300 shadow-sm">
          <div className="flex items-center gap-1.5 font-bold">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>Site 100% Seguro e Verificado</span>
          </div>
          <span className="text-emerald-500/40 hidden sm:inline">|</span>
          <span className="text-slate-300">Criptografia SSL 256-Bit</span>
          <span className="text-emerald-500/40 hidden sm:inline">|</span>
          <span className="text-slate-300 hidden sm:inline">Proteção LGPD</span>
          <span className="text-emerald-500/40 hidden sm:inline">|</span>
          <span className="text-slate-300">API Oficial Meta WhatsApp</span>
        </div>

        {/* Legal & Copyright (5-click secret trigger for store owner admin access) */}
        <div className="text-[11px] text-slate-400 space-y-1 select-none">
          <p
            onClick={handleSecretClick}
            className="cursor-default"
          >
            © {new Date().getFullYear()} {BRAND_CONFIG.name} · CNPJ: {BRAND_CONFIG.cnpj} · Todos os direitos reservados.
          </p>
          <p className="flex items-center justify-center gap-1">
            Feito com <Heart className="h-2.5 w-2.5 fill-rose-500 text-rose-500 inline" /> para surpreender crianças em todo o Brasil.
          </p>
        </div>
      </div>

      {/* Terms and Privacy Modal */}
      <TermsModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        defaultTab={termsTab}
      />
    </footer>
  );
};
