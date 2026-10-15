import React from 'react';
import { Heart, Sparkles, Trophy, Award, Shield } from 'lucide-react';

export const ImpactSection: React.FC = () => {
  return (
    <section className="py-20 px-4 sm:px-6 relative border-t border-white/5 bg-[#140e29]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-pink-500/30 bg-pink-500/10 px-3.5 py-1 text-xs font-semibold text-pink-300 mb-3">
            <Heart className="h-3.5 w-3.5 fill-pink-300" />
            Impacto Real
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-black text-white">
            Mais que um parabéns, um incentivo{' '}
            <span className="text-gradient-gold">para a vida toda.</span>
          </h2>
          <p className="mt-3 text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Crianças veem seus heróis e ídolos como grandes modelos de conduta. Quando o personagem elogia suas atitudes, essa mensagem se fixa profundamente no coração.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="glass-card p-6 rounded-2xl border border-white/10 hover:border-amber-400/40 transition">
            <div className="h-12 w-12 rounded-xl bg-amber-400/15 flex items-center justify-center text-amber-400 mb-4">
              <Trophy className="h-6 w-6" />
            </div>
            <h3 className="font-display text-lg font-bold text-white mb-2">
              Autoconfiança
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Ouvir o próprio ídolo citando seu nome e enaltecendo sua coragem fortalece a autoestima e faz a criança se sentir invencível.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-white/10 hover:border-amber-400/40 transition">
            <div className="h-12 w-12 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-400 mb-4">
              <Award className="h-6 w-6" />
            </div>
            <h3 className="font-display text-lg font-bold text-white mb-2">
              Bons Hábitos & Valores
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Mensagens focadas em obediência com amor, generosidade com os amigos, dedicação nos estudos e superação de medos.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-white/10 hover:border-amber-400/40 transition">
            <div className="h-12 w-12 rounded-xl bg-purple-500/15 flex items-center justify-center text-purple-400 mb-4">
              <Shield className="h-6 w-6" />
            </div>
            <h3 className="font-display text-lg font-bold text-white mb-2">
              Memória Afetiva Eterna
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Ao contrário de brinquedos que quebram ou são esquecidos no armário, o vídeo fica guardado para sempre no acervo da família.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
