import React, { useState } from 'react';
import { Star, ShieldCheck, Heart, Sparkles, Quote, ThumbsUp, CheckCircle2 } from 'lucide-react';
import { BRAND_CONFIG } from '../config/brand';

interface Testimonial {
  id: string;
  parentName: string;
  relation: string;
  childName: string;
  childAge: string;
  city: string;
  characterName: string;
  characterEmoji: string;
  rating: number;
  date: string;
  text: string;
  highlight: string;
  avatarBg: string;
  photoUrl?: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    parentName: 'Mariana Silveira',
    relation: 'Mãe do',
    childName: 'Miguel',
    childAge: '5 anos',
    city: 'São Paulo, SP',
    characterName: 'Homem-Aranha',
    characterEmoji: '🕷️',
    rating: 5,
    date: 'Ontem',
    highlight: 'Ele ficou paralisado de emoção!',
    text: 'O Miguel ficou com o olhinho brilhando quando o Homem-Aranha chamou ele pelo nome! Ele não acreditava que o herói dele sabia até que ele arrumou os brinquedos. Já assistimos umas 15 vezes seguidas e ele mostrou pra todos os amiguinhos.',
    avatarBg: 'from-red-500 to-blue-600',
    photoUrl: 'https://images.unsplash.com/photo-1543332164-6e82f355badc?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'test-2',
    parentName: 'Rodrigo Fontes',
    relation: 'Pai da',
    childName: 'Sophia',
    childAge: '4 anos',
    city: 'Belo Horizonte, MG',
    characterName: 'Elsa Frozen',
    characterEmoji: '❄️',
    rating: 5,
    date: 'Há 3 dias',
    highlight: 'Chorou de alegria com o recado',
    text: 'A Sophia é simplesmente apaixonada na Elsa. Quando começou o vídeo e a Elsa falou sobre o carinho dela com a irmãzinha, ela colocou a mãozinha no peito e começou a chorar de alegria. Valeu cada centavo, uma memória que guardaremos para sempre.',
    avatarBg: 'from-sky-400 to-blue-600',
    photoUrl: 'https://images.unsplash.com/photo-1517456793572-1d8efd6dc135?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'test-3',
    parentName: 'Camila Andrade',
    relation: 'Dinda do',
    childName: 'Davi',
    childAge: '6 anos',
    city: 'Curitiba, PR',
    characterName: 'Batman',
    characterEmoji: '🦇',
    rating: 5,
    date: 'Há 5 dias',
    highlight: 'Melhor presente que pude mandar de longe',
    text: 'Moro longe do meu afilhado e não pude ir na festinha. Mandei o vídeo pelo WhatsApp e a minha irmã gravou a reação dele para me mandar. A voz do Batman é idêntica! Ele ficou com postura de herói e disse que agora é o parceiro do Batman.',
    avatarBg: 'from-slate-700 to-zinc-900',
    photoUrl: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'test-4',
    parentName: 'Juliana Castro',
    relation: 'Mãe do',
    childName: 'Theo',
    childAge: '3 anos',
    city: 'Rio de Janeiro, RJ',
    characterName: 'Chase (Patrulha Canina)',
    characterEmoji: '🐾',
    rating: 5,
    date: 'Há 1 semana',
    highlight: 'Nos ajudou na rotina e no desfralde!',
    text: 'Estávamos com dificuldade no desfralde e para ele dormir no próprio quarto. O Chase elogiou a coragem dele nessa nova fase e disse que era uma missão oficial de filhote. No mesmo dia ele dormiu sozinho sem chorar! A magia funciona de verdade.',
    avatarBg: 'from-blue-600 to-indigo-800',
    photoUrl: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=300&q=80'
  }
];

export const TestimonialsSection: React.FC<{ onStartCreating?: () => void }> = ({ onStartCreating }) => {
  const [filterChar, setFilterChar] = useState<string>('todos');

  const filteredTestimonials = filterChar === 'todos' 
    ? TESTIMONIALS 
    : TESTIMONIALS.filter(t => t.characterName.toLowerCase().includes(filterChar.toLowerCase()));

  return (
    <section id="depoimentos" className="py-20 px-4 sm:px-6 relative border-t border-white/5 bg-[#100a22]">
      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-amber-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-3.5 py-1 text-xs font-semibold text-amber-300 mb-3">
            <Heart className="h-3.5 w-3.5 fill-amber-300 text-amber-300" />
            <span>Depoimentos Verificados</span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-black text-white leading-tight">
            Histórias Reais de <span className="text-gradient-gold">Famílias Encantadas</span>
          </h2>

          <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Veja como pais, mães e padrinhos transformaram o aniversário e a rotina dos seus pequenos com a magia do {BRAND_CONFIG.name}.
          </p>

          {/* Social Proof Score Banner */}
          <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-2.5 backdrop-blur-sm">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="font-display text-sm font-bold text-white">
              4.9 de 5.0 estrelas
            </span>
            <span className="text-slate-400 text-xs hidden sm:inline">·</span>
            <span className="text-xs text-slate-300">
              Mais de <strong>1.480 avaliações</strong> verificadas
            </span>
            <span className="text-slate-400 text-xs hidden sm:inline">·</span>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400">
              <ShieldCheck className="h-3.5 w-3.5" />
              100% Satisfação Garantida
            </span>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredTestimonials.map((item) => (
            <div
              key={item.id}
              className="glass-card p-6 sm:p-7 rounded-3xl relative flex flex-col justify-between border border-white/10 hover:border-amber-400/40 transition-all hover:-translate-y-1 shadow-xl"
            >
              <div>
                {/* Header of review: Stars + Character badge + Verification */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>

                  <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-amber-300">
                    <span>{item.characterEmoji}</span>
                    <span>{item.characterName}</span>
                  </span>
                </div>

                {/* Highlight title */}
                <h4 className="font-display text-base font-bold text-white mb-2 flex items-center gap-1.5">
                  <Quote className="h-4 w-4 text-amber-400 shrink-0 rotate-180" />
                  <span>"{item.highlight}"</span>
                </h4>

                {/* Quote text */}
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                  {item.text}
                </p>
              </div>

              {/* Author Footer info */}
              <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-auto">
                <div className="flex items-center gap-3">
                  {/* Photo or styled Avatar */}
                  <div className="relative h-11 w-11 rounded-full overflow-hidden ring-2 ring-amber-400/40 shrink-0">
                    {item.photoUrl ? (
                      <img
                        src={item.photoUrl}
                        alt={`Foto da criança ${item.childName}`}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : null}
                    <div
                      className={`h-full w-full flex items-center justify-center bg-gradient-to-br ${item.avatarBg} text-white font-bold text-sm`}
                    >
                      {item.childName.charAt(0)}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-display text-sm font-bold text-white">
                        {item.parentName}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 block">
                      {item.relation} <strong className="text-amber-300 font-semibold">{item.childName} ({item.childAge})</strong> · {item.city}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold shrink-0">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Verificado</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Strip */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="glass-card p-4 rounded-2xl border border-white/10">
            <span className="block font-display text-2xl sm:text-3xl font-black text-gradient-gold">
              +15.000
            </span>
            <span className="text-xs text-slate-400">Crianças Emocionadas</span>
          </div>
          <div className="glass-card p-4 rounded-2xl border border-white/10">
            <span className="block font-display text-2xl sm:text-3xl font-black text-gradient-gold">
              99.4%
            </span>
            <span className="text-xs text-slate-400">Avaliações 5 Estrelas</span>
          </div>
          <div className="glass-card p-4 rounded-2xl border border-white/10">
            <span className="block font-display text-2xl sm:text-3xl font-black text-gradient-gold">
              5 min
            </span>
            <span className="text-xs text-slate-400">Entrega no WhatsApp</span>
          </div>
          <div className="glass-card p-4 rounded-2xl border border-white/10">
            <span className="block font-display text-2xl sm:text-3xl font-black text-gradient-gold">
              100%
            </span>
            <span className="text-xs text-slate-400">Garantia Incondicional</span>
          </div>
        </div>

        {/* Optional Call to Action */}
        {onStartCreating && (
          <div className="mt-10 text-center">
            <button
              onClick={onStartCreating}
              className="btn-magic inline-flex items-center gap-2 text-sm font-bold text-slate-950 px-8 py-3.5"
            >
              <Sparkles className="h-4 w-4 fill-slate-950" />
              <span>Surpreender Meu Filho com um Vídeo Mágico</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
