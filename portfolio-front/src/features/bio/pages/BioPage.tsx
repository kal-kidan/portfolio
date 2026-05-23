import { Link } from 'react-router-dom';
import { PortfolioOsAudio } from '../../landing/components/portfolio-os/PortfolioOsAudio';
import '../../landing/components/portfolio-os/portfolio-os.css';
import { ApartmentPanoramaViewer } from '../components/ApartmentPanoramaViewer';
import '../bio-page.css';

export function BioPage() {
  return (
    <main className="bio-page">
      <div className="bio-page__bleed" aria-hidden />

      <div className="bio-page__viewport">
        <ApartmentPanoramaViewer className="bio-page__image" />
      </div>

      <header className="bio-page__chrome">
        <Link className="bio-page__back" to="/home">
          ← Eject disk
        </Link>
        <p className="bio-page__boot">&gt; BIO.DISC</p>
      </header>

      <p className="portfolio-os-status bio-page__status" aria-live="polite">
        &gt; BIO.DISC loaded
      </p>

      <PortfolioOsAudio />
    </main>
  );
}
