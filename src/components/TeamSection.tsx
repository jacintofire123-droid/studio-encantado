import React from 'react';
import { TEAM_MEMBERS } from '../data/content';
import { Users, Instagram } from 'lucide-react';

export const TeamSection: React.FC = () => {
  return (
    <section className="py-20 px-4 sm:px-6 relative border-t border-white/5 bg-[#140e29]">
      <div className="max-w-4xl mx-auto text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Users className="h-5 w-5 text-amber-400" />
          <span className="text-amber-300 font-semibold text-xs uppercase tracking-wider">
            Gente de Verdade
          </span>
        </div>
        <h2 className="text-3xl md:text-4xl font-display font-black text-white">
          Quem faz a <span className="text-gradient-gold">mágica acontecer</span>
        </h2>
        <p className="mt-2 text-sm text-slate-300 max-w-xl mx-auto">
          Nosso time de animadores, dubladores e suporte dedicado a fazer sua criança sorrir
        </p>

        {/* Team Grid */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {TEAM_MEMBERS.map((member) => (
            <div
              key={member.name}
              className="glass-card p-4 rounded-2xl flex flex-col items-center border border-white/10 hover:border-amber-400/40 transition group"
            >
              <div className="relative mb-3">
                <img
                  src={member.image}
                  alt={member.name}
                  loading="lazy"
                  className="h-20 w-20 rounded-full object-cover ring-2 ring-amber-400/40 group-hover:scale-105 transition"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80';
                  }}
                />
              </div>
              <h4 className="font-display text-sm font-bold text-white">
                {member.name}
              </h4>
              <a
                href={member.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-flex items-center gap-1 text-[11px] text-amber-400/80 hover:text-amber-300 transition"
              >
                <Instagram className="h-3 w-3" />
                <span>{member.handle}</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
