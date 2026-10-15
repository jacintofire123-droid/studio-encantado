import React, { useState, useRef, useEffect } from 'react';
import { Character, MessageOccasion } from '../../types';
import { ArrowLeft, Sparkles, Cake, Star, Award, Info, MessageCircle } from 'lucide-react';

interface ChildNameStepProps {
  character: Character;
  childName: string;
  occasion: MessageOccasion;
  customerPhone?: string;
  onNameChange: (name: string) => void;
  onOccasionChange: (occasion: MessageOccasion) => void;
  onPhoneChange?: (phone: string) => void;
  onBack: () => void;
  onSubmit: () => void;
}

const OCCASIONS: { id: MessageOccasion; label: string; icon: React.ReactNode; desc: string }[] = [
  {
    id: 'aniversario',
    label: 'Aniversário & Parabéns',
    icon: <Cake className="h-4 w-4" />,
    desc: 'Celebração com parabéns, bolo e felicitações'
  },
  {
    id: 'elogio',
    label: 'Elogio & Bons Hábitos',
    icon: <Star className="h-4 w-4" />,
    desc: 'Incentivo para rotina, obediência e estudos'
  },
  {
    id: 'conquista',
    label: 'Coragem & Conquistas',
    icon: <Award className="h-4 w-4" />,
    desc: 'Superação de medo, dentista, escola ou desfralde'
  }
];

export const ChildNameStep: React.FC<ChildNameStepProps> = ({
  character,
  childName,
  occasion,
  customerPhone = '',
  onNameChange,
  onOccasionChange,
  onPhoneChange,
  onBack,
  onSubmit
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [showLongNameModal, setShowLongNameModal] = useState(false);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const words = childName.trim().split(/\s+/).filter(Boolean);
  // Nomes compostos como "Miguel Henrique" ou "Maria Alice" são perfeitos.
  // Alerta apenas quando tiver mais de 3 palavras (ex: sobrenomes de família completos).
  const isTooLong = words.length > 3;

  // Formatador de WhatsApp brasileiro
  const handlePhoneInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);

    if (value.length > 6) {
      value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
    } else if (value.length > 2) {
      value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    } else if (value.length > 0) {
      value = `(${value}`;
    }
    onPhoneChange?.(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!childName.trim()) return;

    if (isTooLong) {
      setShowLongNameModal(true);
      return;
    }

    onSubmit();
  };

  return (
    <div className="mx-auto w-full max-w-lg px-4 py-8">
      {/* Back button */}
      <button
        onClick={onBack}
        className="mb-6 inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Trocar personagem
      </button>

      {/* Selected character badge */}
      <div className="text-center">
        <div className="relative mx-auto inline-block">
          <img
            src={character.image}
            alt={character.name}
            className="h-28 w-28 rounded-full object-cover ring-4 ring-fuchsia-400/50 shadow-xl shadow-fuchsia-500/20"
            onError={(e) => {
              e.currentTarget.src = 'https://www.recadinhomagico.com.br/characters/mystery-character.png';
            }}
          />
          <span className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-lg border border-fuchsia-400/40 shadow">
            {character.emoji}
          </span>
        </div>

        <h2 className="mt-5 font-display text-2xl sm:text-3xl font-bold text-white">
          Personalize a mensagem de <span className="text-gradient-encantado">{character.name}</span>
        </h2>
        <p className="mt-2 text-sm text-slate-300">
          O personagem vai falar o nome e gravar com foco na ocasião escolhida
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="mt-7 space-y-5">
        {/* Child Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 text-center">
            Qual o primeiro nome da criança?
          </label>
          <input
            ref={inputRef}
            type="text"
            required
            maxLength={40}
            value={childName}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Ex: Miguel Henrique ou Ana Júlia"
            className={`h-14 w-full rounded-2xl border bg-black/40 px-4 text-center text-lg sm:text-xl font-bold text-white placeholder-slate-500 shadow-inner transition focus:outline-none focus:ring-2 ${
              isTooLong
                ? 'border-fuchsia-400 focus:ring-fuchsia-400 text-fuchsia-200'
                : 'border-white/15 focus:border-fuchsia-400 focus:ring-fuchsia-400'
            }`}
          />
        </div>

        {/* WhatsApp Phone */}
        <div>
          <div className="flex items-center justify-between mb-1.5 px-1">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <MessageCircle className="h-4 w-4 text-emerald-400" />
              <span>Qual o seu WhatsApp para receber o vídeo?</span>
            </label>
            <span className="text-[10px] text-emerald-400 font-medium bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              Envio Automático
            </span>
          </div>
          <div className="relative">
            <input
              type="tel"
              required
              value={customerPhone}
              onChange={handlePhoneInputChange}
              placeholder="(11) 98765-4321"
              maxLength={15}
              className="h-12 w-full rounded-2xl border border-white/15 bg-black/40 px-4 text-left sm:text-center text-base font-medium text-white placeholder-slate-500 shadow-inner transition focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>
          <p className="mt-1 text-[11px] text-slate-400 px-1">
            📱 É por este número que o n8n vai entregar o link do vídeo final em alta definição assim que o Pix for aprovado.
          </p>
        </div>

        {/* Occasion / Theme Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-2">
            Qual a ocasião especial do recado?
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {OCCASIONS.map((occ) => {
              const isSelected = occasion === occ.id;
              return (
                <button
                  key={occ.id}
                  type="button"
                  onClick={() => onOccasionChange(occ.id)}
                  className={`flex flex-col items-center justify-center rounded-2xl border p-3 text-center transition ${
                    isSelected
                      ? 'border-fuchsia-400 bg-fuchsia-500/20 text-white shadow-md shadow-fuchsia-500/20'
                      : 'border-white/10 bg-white/5 text-slate-400 hover:text-white hover:border-white/20'
                  }`}
                >
                  <div className={`mb-1.5 ${isSelected ? 'text-fuchsia-300' : 'text-slate-400'}`}>
                    {occ.icon}
                  </div>
                  <span className="font-display text-xs font-bold leading-tight">
                    {occ.label}
                  </span>
                  <span className="mt-1 text-[10px] text-slate-400 line-clamp-1">
                    {occ.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tip / Segredo da Magia */}
        <div
          className={`rounded-2xl border p-3.5 text-center text-xs leading-relaxed transition-all ${
            isTooLong
              ? 'border-fuchsia-400/60 bg-fuchsia-400/10 text-fuchsia-200'
              : 'border-purple-400/25 bg-purple-500/10 text-slate-300'
          }`}
        >
          <div className="flex items-center justify-center gap-1.5 text-fuchsia-300 font-bold mb-1">
            <Sparkles className="h-4 w-4 fill-fuchsia-400 text-fuchsia-400" />
            <span>Segredo da magia:</span>
          </div>
          <p>
            Pode usar o <strong>primeiro nome</strong> ou o composto (ex:{' '}
            <em className="text-cyan-300">Miguel Henrique</em> ou{' '}
            <em className="text-cyan-300">Maria Alice</em>). O personagem vai pronunciar com a voz dele perfeitamente!
          </p>
        </div>

        {/* Action Button: Ver Vídeo Encantado */}
        <button
          type="submit"
          disabled={!childName.trim()}
          className="btn-magic h-14 w-full flex items-center justify-center gap-2 text-base font-bold shadow-xl shadow-amber-500/20 disabled:opacity-50 disabled:pointer-events-none transition-all hover:scale-[1.01]"
        >
          <Sparkles className="h-5 w-5 fill-slate-950" />
          <span>
            {childName.trim()
              ? `Ver Vídeo Encantado de ${character.name} para ${childName.trim()} ✨`
              : 'Ver Vídeo Encantado ✨'}
          </span>
        </button>
      </form>

      {/* Long Name Warning Modal */}
      {showLongNameModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl border border-amber-400/40 bg-[#1e1438] p-6 text-center shadow-2xl">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-amber-400/20 text-amber-400">
              <Info className="h-6 w-6" />
            </div>
            <h3 className="font-display text-xl font-bold text-white">
              ✨ Opa, deixa eu contar um segredo!
            </h3>
            <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
              A voz do personagem é gravada de verdade, e colocar o sobrenome inteiro (ex: <em>{childName}</em>) faz a pronúncia perder a naturalidade.
              <br />
              <br />
              Recomendamos usar apenas o <strong>primeiro nome</strong>. Assim a criança ouve o nome dela do jeitinho certo!
            </p>
            <div className="mt-5 space-y-2">
              <button
                type="button"
                onClick={() => {
                  setShowLongNameModal(false);
                  inputRef.current?.focus();
                }}
                className="w-full rounded-xl bg-amber-400 py-3 text-sm font-bold text-slate-950 hover:bg-amber-300"
              >
                Entendi, vou encurtar o nome
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLongNameModal(false);
                  onSubmit();
                }}
                className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 text-xs text-slate-400 hover:text-white"
              >
                Manter assim mesmo e continuar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
