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
  const beatOnRef = useRef(true);
  const [beatOn, setBeatOn] = useState(true);

  const tryStartBeat = useCallback(async () => {
    const engine = engineRef.current;
    if (!engine || !beatOnRef.current || engine.isRunning) return;
    try {
      await engine.start();
    } catch {
      /* autoplay policy — wait for gesture */
    }
  }, []);

  useEffect(() => {
    const engine = new PortfolioAmbientEngine();
    engineRef.current = engine;
    registerPortfolioAudioEngine(engine);
    void tryStartBeat();

    const onFirstInteract = (e: Event) => {
      const target = e.target;
      if (
        target instanceof Element &&
        target.closest('.portfolio-os-audio')
      ) {
        return;
      }
      void tryStartBeat();
    };

    window.addEventListener('pointerdown', onFirstInteract, {
      capture: true,
      passive: true,
    });
    window.addEventListener('keydown', onFirstInteract, { capture: true });

    return () => {
      window.removeEventListener('pointerdown', onFirstInteract, {
        capture: true,
      });
      window.removeEventListener('keydown', onFirstInteract, { capture: true });
      engine.dispose();
      engineRef.current = null;
      registerPortfolioAudioEngine(null);
    };
  }, [tryStartBeat]);

  const toggle = useCallback(async () => {
    const engine = engineRef.current;
    if (!engine) return;

    const next = !beatOnRef.current;
    beatOnRef.current = next;
    setBeatOn(next);

    if (!next) {
      engine.stopMusic();
      return;
    }

    await tryStartBeat();
  }, [tryStartBeat]);

  if (prefersReducedMotion()) {
    return null;
  }

  return (
    <button
      type="button"
      className={[
        'portfolio-os-audio',
        beatOn ? 'portfolio-os-audio--on' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={() => void toggle()}
      aria-pressed={beatOn}
      aria-label={
        beatOn ? 'Mute portfolio ambient audio' : 'Enable portfolio ambient audio'
      }
    >
      <span className="portfolio-os-audio__led" aria-hidden />
      <span className="portfolio-os-audio__label">
        {beatOn ? 'BEAT: ON' : 'BEAT: OFF'}
      </span>
    </button>
  );
}
