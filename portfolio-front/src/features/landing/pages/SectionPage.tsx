import { Link, useLocation } from 'react-router-dom';
import {
  PORTFOLIO_DISKS,
  SECTION_META,
  type DiskId,
} from '../config/portfolio-os.config';

const ROUTE_TO_ID = Object.fromEntries(
  PORTFOLIO_DISKS.map((d) => [d.route, d.id]),
) as Record<string, DiskId>;

export function SectionPage() {
  const { pathname } = useLocation();
  const id = ROUTE_TO_ID[pathname];
  const meta = id ? SECTION_META[id] : null;

  if (!meta) {
    return (
      <main className="section-shell section-shell--error">
        <p>Save file not found.</p>
        <Link to="/home">← Return to Portfolio OS</Link>
      </main>
    );
  }

  return (
    <main className="section-shell">
      <p className="section-shell__boot">&gt; BOOTING {meta.title.toUpperCase()}…</p>
      <h1 className="section-shell__title">{meta.title}</h1>
      <p className="section-shell__desc">{meta.description}</p>
      <p className="section-shell__hint">
        Game module placeholder — build your {meta.title.toLowerCase()} experience
        here.
      </p>
      <Link className="section-shell__back" to="/home">
        ← Eject disk / Home
      </Link>
    </main>
  );
}
