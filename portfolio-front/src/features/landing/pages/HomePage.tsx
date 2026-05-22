import { Link } from 'react-router-dom';
import { PORTFOLIO_DISKS } from '../config/portfolio-os.config';
import { PortfolioOsScene } from '../components/portfolio-os/PortfolioOsScene';

export function HomePage() {
  return (
    <div className="portfolio-os-page">
      <PortfolioOsScene />

      <nav className="portfolio-os-fallback" aria-label="Quick navigation">
        {PORTFOLIO_DISKS.map((disk) => (
          <Link key={disk.id} to={disk.route}>
            {disk.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
