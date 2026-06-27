import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PortfolioOsAudio } from '../../landing/components/portfolio-os/PortfolioOsAudio';
import '../../landing/components/portfolio-os/portfolio-os.css';
import { BioApartmentGame } from '../components/BioApartmentGame';
import { HudGameCard } from '../components/HudGameCard';
import { BIO_AIM_STATUS, BIO_INTRO, BIO_TIP } from '../config/bio-game.config';
import '../bio-page.css';
import '../hud-card.css';

export function BioPage() {
  const [status, setStatus] = useState('> Click the bow to begin');
  const [showIntro, setShowIntro] = useState(true);
  const [showTipCard, setShowTipCard] = useState(false);

  const handleBowClick = () => {
    setShowTipCard(true);
    setStatus('> Bow equipped — press Start shooting');
  };

  const handleStartShooting = () => {
    setShowIntro(false);
    setShowTipCard(false);
    setStatus('> Switching to combat cam…');
  };

  return (
    <main className="bio-page">
      <div className="bio-page__bleed" aria-hidden />

      <div className="bio-page__viewport">
        <BioApartmentGame
          className="bio-page__image"
          onBowClick={handleBowClick}
          onStartShooting={handleStartShooting}
          onAimReady={() => setStatus(`> ${BIO_AIM_STATUS}`)}
        />
      </div>

      {showIntro && (
        <div className="bio-page__hud bio-page__hud--top">
          <HudGameCard showProgress={false} aria-label="About">
            <p>{BIO_INTRO}</p>
          </HudGameCard>
        </div>
      )}

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
