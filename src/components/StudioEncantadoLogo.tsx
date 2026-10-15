import React from 'react';

interface StudioEncantadoLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showTagline?: boolean;
  layout?: 'horizontal' | 'vertical';
  className?: string;
}

export const StudioEncantadoIcon: React.FC<{ size?: number; className?: string }> = ({
  size = 40,
  className = ''
}) => {
  const uniqueId = React.useId().replace(/:/g, '');

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Background warm golden-magic radial glow */}
      <div
        className="absolute inset-0 rounded-full blur-md opacity-75 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(251,191,36,0.6) 0%, rgba(245,158,11,0.3) 55%, transparent 100%)'
        }}
      />

      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative w-full h-full drop-shadow-[0_0_12px_rgba(245,158,11,0.7)]"
      >
        <defs>
          {/* Main 4-point star signature gold palette gradient */}
          <linearGradient id={`starGrad-${uniqueId}`} x1="15%" y1="15%" x2="85%" y2="85%">
            <stop offset="0%" stopColor="#fffbeb" />
            <stop offset="20%" stopColor="#fde047" />
            <stop offset="60%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#ea580c" />
          </linearGradient>

          {/* Warm center radial shimmer */}
          <radialGradient id={`warmCenter-${uniqueId}`} cx="50%" cy="50%" r="45%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="40%" stopColor="#fef08a" stopOpacity="0.6" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>

          {/* Outer glow filter */}
          <filter id={`neonGlow-${uniqueId}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Orbiting accent 1: Top-Left Golden Sparkle */}
        <path
          d="M26 23 Q26 28 21 28 Q26 28 26 33 Q26 28 31 28 Q26 28 26 23 Z"
          fill="#fef08a"
          className="animate-sparkle"
        />

        {/* Orbiting accent 2: Top-Right Amber Orb */}
        <circle cx="76" cy="27" r="3.5" fill="#fde047" className="animate-pulse" />

        {/* Orbiting accent 3: Bottom-Right Deep Gold Orb */}
        <circle cx="75" cy="73" r="3.2" fill="#fbbf24" opacity="0.9" />

        {/* Main 4-point organic star with play triangle cutout */}
        <path
          d="
            M 50 12
            C 51 32 68 49 88 50
            C 68 51 51 68 50 88
            C 49 68 32 51 12 50
            C 32 49 49 32 50 12
            Z
            M 44 40
            L 60 50
            L 44 60
            Z
          "
          fill={`url(#starGrad-${uniqueId})`}
          fillRule="evenodd"
          filter={`url(#neonGlow-${uniqueId})`}
        />

        {/* Center glowing light highlight overlay */}
        <path
          d="
            M 50 12
            C 51 32 68 49 88 50
            C 68 51 51 68 50 88
            C 49 68 32 51 12 50
            C 32 49 49 32 50 12
            Z
            M 44 40
            L 60 50
            L 44 60
            Z
          "
          fill={`url(#warmCenter-${uniqueId})`}
          fillRule="evenodd"
          style={{ mixBlendMode: 'screen' }}
        />

        {/* Interior crisp border around triangle play */}
        <polygon
          points="44,40 60,50 44,60"
          fill="none"
          stroke="rgba(255,255,255,0.7)"
          strokeWidth="0.9"
        />
      </svg>
    </div>
  );
};

export const StudioEncantadoLogo: React.FC<StudioEncantadoLogoProps> = ({
  size = 'md',
  showTagline = false,
  layout = 'horizontal',
  className = ''
}) => {
  // Dimensions map
  const iconSizes = {
    sm: 28,
    md: 38,
    lg: 52,
    hero: 80
  };

  const fontSizes = {
    sm: { studio: 'text-[11px]', encantado: 'text-base', gap: 'gap-2' },
    md: { studio: 'text-xs', encantado: 'text-xl', gap: 'gap-2.5' },
    lg: { studio: 'text-sm', encantado: 'text-2xl sm:text-3xl', gap: 'gap-3.5' },
    hero: { studio: 'text-base sm:text-lg', encantado: 'text-4xl sm:text-5xl', gap: 'gap-4' }
  };

  const currentSize = fontSizes[size];
  const iconPx = iconSizes[size];

  return (
    <div
      className={`inline-flex ${
        layout === 'vertical' ? 'flex-col items-center text-center' : 'items-center text-left'
      } ${currentSize.gap} ${className}`}
    >
      <StudioEncantadoIcon size={iconPx} />

      <div className="flex flex-col leading-none">
        {/* "Studio" in clean crisp white */}
        <span
          className={`font-sans font-medium uppercase tracking-[0.24em] text-white/95 ${currentSize.studio}`}
        >
          Studio
        </span>

        {/* "Encantado" matching the signature gold magic palette */}
        <div className="flex items-center">
          <span
            className={`font-display font-extrabold tracking-tight ${currentSize.encantado}`}
            style={{
              background: 'linear-gradient(135deg, #fef08a 0%, #fde047 25%, #f59e0b 70%, #ea580c 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 2px 12px rgba(245, 158, 11, 0.4))'
            }}
          >
            Encantad
          </span>

          {/* Letter 'O' with embedded star in the same golden magic palette */}
          <span className="relative inline-flex items-center justify-center">
            <span
              className={`font-display font-extrabold tracking-tight ${currentSize.encantado}`}
              style={{
                background: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              o
            </span>
            {/* Sparkle star inside 'o' */}
            <span
              className="absolute pointer-events-none text-[0.45em] text-white drop-shadow-[0_0_6px_#fde047]"
              style={{ transform: 'translate(0px, -0.5px)' }}
            >
              ✦
            </span>
          </span>
        </div>

        {showTagline && (
          <span className="text-[10px] sm:text-xs text-amber-200/80 tracking-normal mt-1 font-sans">
            Vídeos Mágicos de Personagens para Crianças
          </span>
        )}
      </div>
    </div>
  );
};
