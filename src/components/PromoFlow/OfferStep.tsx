import React, { useState, useRef, useEffect } from 'react';
import { Character, OrderData } from '../../types';
import { BRAND_CONFIG } from '../../config/brand';
import { SocialProof } from '../SocialProof';
import { TermsModal } from '../TermsModal';
import {
  getStoredPricing,
  formatCurrency,
  formatInstallment,
  recordLeadCheckoutAttempt
} from '../../services/adminStore';
import {
  Gift,
  ShieldCheck,
  Zap,
  MessageCircle,
  ArrowDown,
  Sparkles,
  CheckCircle2,
  Clock,
  CheckSquare
} from 'lucide-react';

interface OfferStepProps {
  character: Character;
  childName: string;
  initialPhone?: string;
  onInitiateCheckout: (data: {
    email: string;
    whatsapp: string;
    birthYear: string;
  }) => void;
}

export const OfferStep: React.FC<OfferStepProps> = ({
  character,
  childName,
  initialPhone = '',
  onInitiateCheckout
}) => {
  const [pricing, setPricing] = useState(getStoredPricing());
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState(initialPhone);
  const [birthYear, setBirthYear] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const formRef = useRef<HTMLFormElement>(null);
  const proofRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handlePriceUpdate = () => setPricing(getStoredPricing());
    window.addEventListener('studio_pricing_updated', handlePriceUpdate);
    return () => window.removeEventListener('studio_pricing_updated', handlePriceUpdate);
  }, []);

  // Format WhatsApp phone: (XX) 9XXXX-XXXX
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);

    if (value.length > 6) {
      value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
    } else if (value.length > 2) {
      value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    } else if (value.length > 0) {
      value = `(${value}`;
    }
    setWhatsapp(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Por favor, informe um e-mail válido.');
      return;
    }
    const cleanPhone = whatsapp.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMsg('Por favor, informe seu WhatsApp com DDD completo.');
      return;
    }
    if (!termsAccepted) {
      setErrorMsg('É necessário aceitar os Termos de Uso e o envio pelo WhatsApp para continuar.');
      return;
    }

    setErrorMsg('');
    // Record lead with checkout attempt status
    recordLeadCheckoutAttempt(null, {
      childName,
      character,
      parentEmail: email,
      parentWhatsApp: whatsapp,
      birthYear
    });

    onInitiateCheckout({ email, whatsapp, birthYear });
  };

  const scrollToProof = () => {
    proofRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
    const emailInput = formRef.current?.querySelector('input[type="email"]') as HTMLInputElement;
    emailInput?.focus();
  };

  // Generate birth years from 2026 down to 2011
  const currentYear = new Date().getFullYear();
  const birthYears = Array.from({ length: 16 }, (_, i) => currentYear - i);

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8">
      {/* Top scroll to proof trigger button */}
      <div className="text-center mb-6">
        <button
          type="button"
          onClick={scrollToProof}
          className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-400/10 px-4 py-2 text-xs sm:text-sm font-semibold text-amber-300 transition hover:bg-amber-400/20 shadow-sm"
        >
          <span aria-hidden="true">😍</span>
          <span>Role para ver a felicidade das crianças</span>
          <ArrowDown className="h-4 w-4 animate-bounce text-amber-400" />
        </button>
      </div>

      {/* Offer Header */}
      <div className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-400/20 text-amber-400 mb-4 shadow-md">
          <Gift className="h-7 w-7" />
        </div>

        <h2 className="font-display text-2xl sm:text-3xl font-black text-white">
          Quer guardar essa mensagem de <span className="text-gradient-gold">{childName}</span>?
        </h2>

        <p className="mx-auto mt-3 max-w-md text-sm sm:text-base text-slate-300 leading-relaxed">
          Por apenas <strong className="text-amber-300 font-bold text-lg">{formatCurrency(pricing.singleVideoPrice)}</strong> (ou até {formatInstallment(pricing.singleVideoPrice, pricing.singleVideoInstallments)}), nós enviamos o vídeo completo em Full HD no seu WhatsApp e no seu e-mail, para você assistir quantas vezes quiser e compartilhar com toda a família.
        </p>

        {/* Benefits bullets */}
        <div className="mt-5 grid grid-cols-2 gap-2 text-left max-w-md mx-auto text-xs text-slate-200">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>Vídeo Full HD 1080p</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>Entrega em até 5 min</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>Sem marcas d'água</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>Acesso vitalício</span>
          </div>
        </div>
      </div>

      {/* Lead & Conversion Form */}
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="mx-auto mt-8 max-w-md space-y-3.5 rounded-2xl border border-white/15 bg-[#181130]/90 p-5 sm:p-6 shadow-xl backdrop-blur-sm"
      >
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Seu melhor e-mail (para onde enviaremos o arquivo)
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="exemplo@email.com"
            className="h-12 w-full rounded-xl border border-white/15 bg-black/40 px-3.5 text-sm text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            WhatsApp com DDD (para envio do vídeo)
          </label>
          <input
            type="tel"
            required
            value={whatsapp}
            onChange={handlePhoneChange}
            placeholder="(11) 99999-9999"
            className="h-12 w-full rounded-xl border border-white/15 bg-black/40 px-3.5 text-sm text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Ano de nascimento da criança (opcional)
          </label>
          <select
            value={birthYear}
            onChange={(e) => setBirthYear(e.target.value)}
            className="h-12 w-full rounded-xl border border-white/15 bg-[#120c24] px-3.5 text-sm text-white focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
          >
            <option value="">Selecione o ano de nascimento</option>
            {birthYears.map((year) => (
              <option key={year} value={year}>
                {year} ({currentYear - year} anos)
              </option>
            ))}
          </select>
        </div>

        {/* Terms & Official WhatsApp API Consent Checkbox */}
        <label className="flex items-start gap-2.5 cursor-pointer text-left pt-1 select-none">
          <input
            type="checkbox"
            required
            checked={termsAccepted}
            onChange={(e) => {
              setTermsAccepted(e.target.checked);
              if (e.target.checked) setErrorMsg('');
            }}
            className="mt-0.5 h-4 w-4 rounded accent-amber-400 shrink-0"
          />
          <span className="text-[11px] text-slate-300 leading-snug">
            Li e aceito os{' '}
            <button
              type="button"
              onClick={() => setShowTermsModal(true)}
              className="text-amber-400 underline font-semibold hover:text-amber-300"
            >
              Termos de Uso
            </button>{' '}
            e autorizo o envio do vídeo e avisos via{' '}
            <strong className="text-white font-semibold">API Oficial do WhatsApp</strong>.
          </span>
        </label>

        {errorMsg && (
          <p className="text-xs text-rose-400 font-semibold">{errorMsg}</p>
        )}

        <button
          type="submit"
          className="btn-magic h-14 w-full flex items-center justify-center gap-2 text-base font-bold text-slate-950 mt-2"
        >
          <Sparkles className="h-5 w-5 fill-slate-950" />
          <span>Quero receber a mensagem por {formatCurrency(pricing.singleVideoPrice)}</span>
        </button>

        {/* Site Seguro & Verificado Seal */}
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-center shadow-inner">
          <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-400">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>Site 100% Seguro e Verificado</span>
          </div>
          <div className="mt-1 flex items-center justify-center gap-2 text-[11px] text-slate-300">
            <span>Blindagem SSL 256-Bit</span>
            <span className="text-emerald-500/50">·</span>
            <span>Garantia 7 Dias</span>
            <span className="text-emerald-500/50">·</span>
            <span>Entrega WhatsApp Oficial</span>
          </div>
        </div>
      </form>

      {/* Human WhatsApp Team Guarantee Box */}
      <div className="mx-auto mt-8 max-w-md rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 sm:p-5 text-center shadow-lg">
        <p className="text-sm font-bold text-white leading-snug">
          A pronúncia do nome da criança ficou errada? Travou em alguma coisa?
        </p>
        <p className="mt-2 text-xs text-emerald-200/90 leading-relaxed">
          Fala com a gente! Nossa equipe humana do {BRAND_CONFIG.name} está de plantão para te atender e fazer ajustes se necessário.
        </p>
        <a
          href={`https://wa.me/${BRAND_CONFIG.whatsappNumber}?text=Ol%C3%A1!%20Criei%20um%20v%C3%ADdeo%20no%20${encodeURIComponent(BRAND_CONFIG.name)}%20e%20preciso%20de%20ajuda.`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/20 px-4 py-2.5 text-xs sm:text-sm font-bold text-emerald-300 transition hover:bg-emerald-500/30"
        >
          <MessageCircle className="h-4 w-4" />
          <span>Falar com a equipe no WhatsApp</span>
        </a>
      </div>

      {/* Social Proof anchor */}
      <div ref={proofRef} className="scroll-mt-6">
        <SocialProof />
      </div>

      {/* Bottom Conversion CTA */}
      <div className="mt-12 text-center flex flex-col items-center">
        <button
          type="button"
          onClick={scrollToForm}
          className="btn-magic h-14 w-full max-w-md py-4 text-base font-bold text-slate-950 inline-flex items-center justify-center gap-2"
        >
          <Sparkles className="h-5 w-5 fill-slate-950" />
          <span>Garantir Vídeo do(a) {childName} por {formatCurrency(pricing.singleVideoPrice)}</span>
        </button>

        <div className="mt-3 inline-flex items-center gap-2 text-xs text-slate-300">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span className="font-semibold text-emerald-400">Site Seguro e Verificado</span>
          <span className="text-slate-500">·</span>
          <span>Entrega Garantida no WhatsApp Oficial</span>
        </div>
      </div>

      {/* Terms and Privacy Modal */}
      <TermsModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
      />
    </div>
  );
};
