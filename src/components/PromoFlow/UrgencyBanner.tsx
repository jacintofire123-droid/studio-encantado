import React, { useState, useEffect } from 'react';
import { Flame, Clock } from 'lucide-react';

export const UrgencyBanner: React.FC = () => {
  const [secondsLeft, setSecondsLeft] = useState(694); // ~11:34

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 720));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="w-full bg-gradient-to-r from-fuchsia-600 via-purple-600 to-cyan-600 py-1.5 px-3 text-center text-white font-bold text-xs sm:text-[13px] shadow-sm flex items-center justify-center gap-2">
      <span className="flex items-center gap-1">
        <Flame className="h-4 w-4 fill-amber-300 text-amber-300 animate-pulse" />
        <span>Oferta Especial:</span>
      </span>
      <span className="font-medium text-white/90 hidden sm:inline">
        Restam apenas 5 licenças com entrega expressa hoje.
      </span>
      <div className="inline-flex items-center gap-1 rounded bg-black/30 px-2 py-0.5 font-mono text-xs font-black text-amber-300 border border-white/10">
        <Clock className="h-3 w-3 text-amber-300" />
        <span>{formatTimer(secondsLeft)}</span>
      </div>
    </div>
  );
};
