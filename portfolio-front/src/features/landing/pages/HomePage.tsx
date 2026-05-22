import { PortfolioOsAudio } from '../components/portfolio-os/PortfolioOsAudio';
import { PortfolioOsScene } from '../components/portfolio-os/PortfolioOsScene';

export function HomePage() {
  return (
    <div className="portfolio-os-page">
      <PortfolioOsScene />
      <PortfolioOsAudio />
    </div>
  );
}
