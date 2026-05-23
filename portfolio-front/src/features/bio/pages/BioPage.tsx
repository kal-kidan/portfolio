import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  DISC_BOOT_CONTENT_REVEAL_MS,
  isDiscBootNavigation,
} from '../../landing/config/portfolio-os.config';
import { PortfolioOsAudio } from '../../landing/components/portfolio-os/PortfolioOsAudio';
import '../../landing/components/portfolio-os/portfolio-os.css';
import { BioApartmentGame } from '../components/BioApartmentGame';
import { HudGameCard } from '../components/HudGameCard';
import {
  BIO_INTRO,
  BIO_INTRO_CARD_ANIM_MS,
  BIO_INTRO_CARD_DELAY_MS,
  BIO_INTRO_READ_MS,
  BIO_TIP,
} from '../config/bio-game.config';
import '../bio-page.css';
import '../hud-card.css';

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

export function BioPage() {
  const { state } = useLocation();
  const [status, setStatus] = useState(`> ${BIO_TIP}`);
  const [showTipCard, setShowTipCard] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setShowTipCard(true);
      return;
    }

    const bootReveal = isDiscBootNavigation(state)
      ? DISC_BOOT_CONTENT_REVEAL_MS
      : 0;

    const delay =
      bootReveal +
      BIO_INTRO_CARD_DELAY_MS +
      BIO_INTRO_CARD_ANIM_MS +
      BIO_INTRO_READ_MS;

    const id = window.setTimeout(() => setShowTipCard(true), delay);
    return () => window.clearTimeout(id);
  }, [state]);

  return (
    <main className="bio-page">
      <div className="bio-page__bleed" aria-hidden />

      <div className="bio-page__viewport">
        <BioApartmentGame
          className="bio-page__image"
          onStatusChange={setStatus}
        />
      </div>

      <div className="bio-page__hud bio-page__hud--top">
        <HudGameCard showProgress={false} aria-label="About">
          <p>{BIO_INTRO}</p>
        </HudGameCard>
      </div>

      {showTipCard && (
        <div className="bio-page__hud bio-page__hud--bottom bio-page__hud--in">
          <HudGameCard
            className="hud-card--tip"
            badge="GUIDE"
            title="QUEST HINT"
            subtitle="OBJECTIVE"
            progress={62}
            icon={<span className="hud-card__glyph" aria-hidden>⌁</span>}
          >
            <p>{BIO_TIP}</p>
          </HudGameCard>
        </div>
      )}

      <header className="bio-page__chrome">
        <Link className="bio-page__back" to="/home">
          ← Eject disk
        </Link>
        <p className="bio-page__boot">&gt; BIO.DISC</p>
      </header>

      <p className="portfolio-os-status bio-page__status" aria-live="polite">
        {status}
      </p>

      <PortfolioOsAudio />
    </main>
  );
}
