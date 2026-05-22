import { useCallback, useEffect, useRef, useState } from 'react';
import {
  PortfolioAmbientEngine,
  registerPortfolioAudioEngine,
} from './ambientAudio';

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

export function PortfolioOsAudio() {
  const engineRef = useRef<PortfolioAmbientEngine | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const engine = new PortfolioAmbientEngine();
    engineRef.current = engine;
    registerPortfolioAudioEngine(engine);
    return () => {
      engine.dispose();
      engineRef.current = null;
      registerPortfolioAudioEngine(null);
    };
  }, []);

  const toggle = useCallback(async () => {
    let engine = engineRef.current;
    if (!engine) return;

    if (playing) {
      engine.dispose();
      const next = new PortfolioAmbientEngine();
      engineRef.current = next;
      registerPortfolioAudioEngine(next);
      setPlaying(false);
      return;
    }

    await engine.start();
    setPlaying(true);
  }, [playing]);

  if (prefersReducedMotion()) {
    return null;
  }

  return (
    <button
      type="button"
      className={[
        'portfolio-os-audio',
        playing ? 'portfolio-os-audio--on' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={() => void toggle()}
      aria-pressed={playing}
      aria-label={
        playing ? 'Mute portfolio ambient audio' : 'Enable portfolio ambient audio'
      }
    >
      <span className="portfolio-os-audio__led" aria-hidden />
      <span className="portfolio-os-audio__label">
        {playing ? 'BEAT: ON' : 'BEAT: OFF'}
      </span>
    </button>
  );
}
