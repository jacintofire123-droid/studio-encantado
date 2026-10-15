import React from 'react';
import { StudioEncantadoLogo } from './StudioEncantadoLogo';
import { BRAND_CONFIG } from '../config/brand';
import { ShieldCheck } from 'lucide-react';

interface HeaderProps {
  onNavigate?: (view: 'promocao' | 'institucional' | 'admin', sectionId?: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
  return (
    <header className="w-full bg-[#0b071a]/90 backdrop-blur-md py-3.5 px-4 sm:px-6 border-b border-purple-500/10 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: Home / Promo */}
        <div className="w-24 sm:w-32 flex items-center">
          <button
            type="button"
            onClick={() => onNavigate?.('promocao')}
            className="text-xs text-slate-400 hover:text-white transition flex items-center gap-1 font-medium"
          >
            <span>Início</span>
          </button>
        </div>

        {/* Center Logo */}
        <button
          onClick={() => onNavigate?.('promocao')}
          className="group inline-flex items-center justify-center focus:outline-none transition-transform hover:scale-[1.02]"
          aria-label={`${BRAND_CONFIG.name} - Página Inicial`}
        >
          <StudioEncantadoLogo size="md" />
        </button>

        {/* Right: Direct Admin Panel Button */}
        <div className="w-24 sm:w-32 flex justify-end">
          <button
            type="button"
            onClick={() => onNavigate?.('admin')}
            title="Acessar Painel do Lojista (Vídeos, n8n, Leads, Mercado Pago)"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-slate-300 hover:text-amber-300 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-400/40 transition shadow-sm"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Admin</span>
          </button>
        </div>
      </div>
    </header>
  );
};
