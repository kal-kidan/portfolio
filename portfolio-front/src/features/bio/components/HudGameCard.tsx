import type { ReactNode } from 'react';

type HudGameCardProps = {
  children: ReactNode;
  badge?: string;
  title?: string;
  subtitle?: string;
  progress?: number;
  showProgress?: boolean;
  icon?: ReactNode;
  className?: string;
  'aria-label'?: string;
};

/** Game HUD–style female player portrait */
function PlayerGirlIcon() {
  return (
    <svg
      className="hud-card__player-icon"
      viewBox="0 0 48 48"
      aria-hidden
      focusable="false"
    >
      <defs>
        <linearGradient id="hud-player-skin" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f5d0fe" />
          <stop offset="100%" stopColor="#c084fc" />
        </linearGradient>
        <linearGradient id="hud-player-hair" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f0abfc" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
        <linearGradient id="hud-player-gear" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#4c1d95" />
          <stop offset="100%" stopColor="#1e1033" />
        </linearGradient>
      </defs>
      <ellipse cx="24" cy="9" rx="5.5" ry="4" fill="url(#hud-player-hair)" />
      <ellipse cx="24" cy="19" rx="10" ry="11" fill="url(#hud-player-skin)" />
      <path
        d="M14 16 Q13 24 16 30 Q24 34 32 30 Q35 24 34 16 Q30 12 24 11 Q18 12 14 16 Z"
        fill="url(#hud-player-hair)"
      />
      <path
        d="M11 33 Q24 27 37 33 L39 48 L9 48 Z"
        fill="url(#hud-player-gear)"
      />
      <path
        d="M17 33 L24 30 L31 33"
        stroke="#e879f9"
        strokeWidth="1.2"
        fill="none"
        strokeLinecap="round"
      />
      <ellipse cx="20" cy="18" rx="1.2" ry="1.6" fill="#2e1065" />
      <ellipse cx="28" cy="18" rx="1.2" ry="1.6" fill="#2e1065" />
      <path
        d="M21 22 Q24 24 27 22"
        stroke="#a855f7"
        strokeWidth="0.9"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function HudGameCard({
  badge,
  title,
  subtitle,
  children,
  progress = 100,
  showProgress = true,
  icon,
  className = '',
  'aria-label': ariaLabel,
}: HudGameCardProps) {
  const fill = Math.min(100, Math.max(0, progress));
  const label =
    ariaLabel ??
    ([badge, title].filter(Boolean).join(': ') || 'Info card');

  return (
    <article className={`hud-card ${className}`.trim()} aria-label={label}>
      <span className="hud-card__corner hud-card__corner--tl" aria-hidden />
      <span className="hud-card__corner hud-card__corner--tr" aria-hidden />
      <span className="hud-card__corner hud-card__corner--bl" aria-hidden />
      <span className="hud-card__corner hud-card__corner--br" aria-hidden />

      <div
        className={`hud-card__icon${icon ? ' hud-card__icon--custom' : ''}`}
        aria-hidden
      >
        {icon ?? <PlayerGirlIcon />}
      </div>

      <div className="hud-card__body">
        {badge && <p className="hud-card__badge">{badge}</p>}
        {title && <h2 className="hud-card__title">{title}</h2>}
        {subtitle && <p className="hud-card__subtitle">{subtitle}</p>}
        {showProgress && (
          <div
            className="hud-card__bar"
            role="progressbar"
            aria-valuenow={fill}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <span
              className="hud-card__bar-fill"
              style={{ width: `${fill}%` }}
            />
          </div>
        )}
        <div className="hud-card__content">{children}</div>
      </div>
    </article>
  );
}
