import {
  type PropsWithChildren,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useLocation } from 'react-router-dom';
import {
  DISC_BOOT_CONTENT_REVEAL_MS,
  DISC_BOOT_HOLD_MS,
  DISC_BOOT_LINE_MS,
  DISC_BOOT_OVERLAY_FADE_MS,
  getDiscBootLines,
  getDiskByRoute,
  isDiscBootNavigation,
} from '../../config/portfolio-os.config';
import './disc-boot.css';

type BootPhase = 'lines' | 'hold' | 'fade' | 'done';

export function DiscBootGate({ children }: PropsWithChildren) {
  const { pathname, state } = useLocation();
  const bootNav = isDiscBootNavigation(state);
  const bootDiskId = bootNav ? state.diskId : undefined;
  const disk = getDiskByRoute(pathname);
  const lines = useMemo(
    () => getDiscBootLines(bootDiskId ?? disk?.id ?? 'bio'),
    [bootDiskId, disk?.id],
  );

  const [overlayVisible, setOverlayVisible] = useState(bootNav);
  const [overlayFading, setOverlayFading] = useState(false);
  const [contentReady, setContentReady] = useState(!bootNav);
  const [lineIndex, setLineIndex] = useState(-1);
  const [phase, setPhase] = useState<BootPhase>(bootNav ? 'lines' : 'done');
  const timersRef = useRef<number[]>([]);

  const progress =
    phase === 'done'
      ? 100
      : Math.min(
          100,
          ((lineIndex + 1) / lines.length) * 88 + (phase === 'hold' ? 12 : 0),
        );

  useEffect(() => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];

    if (!bootNav) {
      setOverlayVisible(false);
      setContentReady(true);
      setPhase('done');
      return;
    }

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    if (reducedMotion) {
      setLineIndex(lines.length - 1);
      setOverlayVisible(false);
      setContentReady(true);
      setPhase('done');
      return;
    }

    setOverlayVisible(true);
    setOverlayFading(false);
    setContentReady(false);
    setLineIndex(-1);
    setPhase('lines');

    const schedule = (fn: () => void, ms: number) => {
      const id = window.setTimeout(fn, ms);
      timersRef.current.push(id);
    };

    lines.forEach((_, i) => {
      schedule(() => setLineIndex(i), i * DISC_BOOT_LINE_MS);
    });

    const linesEnd = lines.length * DISC_BOOT_LINE_MS;
    schedule(() => setPhase('hold'), linesEnd);
    schedule(() => {
      setOverlayFading(true);
      setPhase('fade');
    }, linesEnd + DISC_BOOT_HOLD_MS);
    schedule(
      () => {
        setOverlayVisible(false);
        setContentReady(true);
        setPhase('done');
      },
      linesEnd + DISC_BOOT_HOLD_MS + DISC_BOOT_OVERLAY_FADE_MS,
    );

    return () => {
      timersRef.current.forEach((id) => window.clearTimeout(id));
      timersRef.current = [];
    };
  }, [bootNav, lines, pathname]);

  const visibleLines = lines.slice(0, lineIndex + 1);
  const discLabel = disk?.discLabel ?? 'DISC';

  return (
    <>
      {overlayVisible && (
        <div
          className={`disc-boot${overlayFading ? ' disc-boot--fade' : ''}`}
          role="status"
          aria-live="polite"
          aria-label={`Booting ${discLabel}`}
        >
          <div className="disc-boot__panel">
            <p className="disc-boot__title">&gt; PORTFOLIO OS · DISK BOOT</p>
            <ul className="disc-boot__log">
              {visibleLines.map((line, i) => (
                <li
                  key={`${line}-${i}`}
                  className={
                    i === visibleLines.length - 1 && phase === 'lines'
                      ? 'disc-boot__line disc-boot__line--active'
                      : 'disc-boot__line'
                  }
                >
                  {line}
                </li>
              ))}
            </ul>
            <div className="disc-boot__bar" aria-hidden>
              <span
                className="disc-boot__bar-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="disc-boot__tag">{discLabel}</p>
          </div>
        </div>
      )}

      <div
        className={`disc-boot-page${contentReady ? ' disc-boot-page--ready' : ''}`}
        style={
          {
            '--disc-boot-reveal-ms': `${DISC_BOOT_CONTENT_REVEAL_MS}ms`,
          } as React.CSSProperties
        }
      >
        {children}
      </div>
    </>
  );
}
