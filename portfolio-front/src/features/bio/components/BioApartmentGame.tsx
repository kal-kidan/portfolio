import { useCallback, useEffect, useRef, useState } from 'react';
import apartmentImage from '@/assets/bio/standing-in-an-apartment.png';
import aimingImage from '@/assets/bio/pointing-bow-to-the-white-board.png';
import bowOverlayImage from '@/assets/bio/bow.png';
import {
  BIO_BOW_OVERLAY,
  BIO_BOW_RECT,
  BIO_CROW_TARGET,
  BIO_SCENE_CUT_MS,
} from '../config/bio-game.config';
import '../bio-game.css';

type BioApartmentGameProps = {
  className?: string;
  onBowClick?: () => void;
  onStartShooting?: () => void;
  onAimReady?: () => void;
};

type ScenePhase = 'apartment' | 'cutting' | 'aiming';

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

export function BioApartmentGame({
  className = '',
  onBowClick,
  onStartShooting,
  onAimReady,
}: BioApartmentGameProps) {
  const [bowUsed, setBowUsed] = useState(false);
  const [scenePhase, setScenePhase] = useState<ScenePhase>('apartment');
  const cutTimerRef = useRef<number | null>(null);

  const isAiming = scenePhase === 'aiming';
  const isCutting = scenePhase === 'cutting';
  const showAimLayer = isCutting || isAiming;

  useEffect(() => {
    return () => {
      if (cutTimerRef.current !== null) {
        window.clearTimeout(cutTimerRef.current);
      }
    };
  }, []);

  const handleBowClick = useCallback(() => {
    if (bowUsed) return;
    setBowUsed(true);
    onBowClick?.();
  }, [bowUsed, onBowClick]);

  const finishCut = useCallback(() => {
    setScenePhase('aiming');
    onAimReady?.();
  }, [onAimReady]);

  const handleStartShooting = useCallback(() => {
    if (scenePhase !== 'apartment' || !bowUsed) return;

    onStartShooting?.();

    if (prefersReducedMotion()) {
      setScenePhase('aiming');
      onAimReady?.();
      return;
    }

    setScenePhase('cutting');
    cutTimerRef.current = window.setTimeout(finishCut, BIO_SCENE_CUT_MS);
  }, [bowUsed, finishCut, onAimReady, onStartShooting, scenePhase]);

  return (
    <div
      className={[
        'bio-game',
        isAiming && 'bio-game--aiming',
        isCutting && 'bio-game--cutting',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div
        className={[
          'bio-game__scene',
          isCutting && 'bio-game__scene--cut',
        ]
          .filter(Boolean)
          .join(' ')}
        role="presentation"
      >
        {showAimLayer && (
          <>
            <div
              className="bio-game__aim-bleed bio-game__aim-bleed--left"
              aria-hidden
            />
            <div
              className="bio-game__aim-bleed bio-game__aim-bleed--right"
              aria-hidden
            />
          </>
        )}

        {!isAiming && (
          <img
            src={apartmentImage}
            alt="Kal in a cyberpunk apartment in Addis Ababa"
            className="bio-game__image bio-game__image--base"
            draggable={false}
          />
        )}

        {showAimLayer && (
          <div className="bio-game__aim-frame">
            <img
              src={aimingImage}
              alt="Kal aiming a bow at the crowned lion tapestry"
              className="bio-game__image bio-game__image--aim"
              draggable={false}
            />
            <img
              src={bowOverlayImage}
              alt=""
              className="bio-game__bow-overlay"
              style={{
                transformOrigin: `${BIO_BOW_OVERLAY.tailX}% ${BIO_BOW_OVERLAY.tailY}%`,
                transform: `translate(${BIO_BOW_OVERLAY.anchorX - BIO_BOW_OVERLAY.tailX}%, ${BIO_BOW_OVERLAY.anchorY - BIO_BOW_OVERLAY.tailY}%) scale(${BIO_BOW_OVERLAY.scale}) rotate(${BIO_BOW_OVERLAY.rotate}deg)`,
              }}
              draggable={false}
              aria-hidden
            />
            {isAiming && (
              <div
                className="bio-game__reticle"
                style={{
                  left: `${BIO_CROW_TARGET.x}%`,
                  top: `${BIO_CROW_TARGET.y}%`,
                }}
                aria-hidden
              />
            )}
          </div>
        )}

        {isCutting && (
          <div className="bio-game__cut" aria-hidden>
            <div className="bio-game__cut-flash" />
            <div className="bio-game__cut-scan" />
            <div className="bio-game__cut-lines" />
            <div className="bio-game__cut-vignette" />
            <p className="bio-game__cut-tag">&gt; COMBAT CAM · ENGAGED</p>
            <div className="bio-game__cut-bar">
              <span className="bio-game__cut-bar-fill" />
            </div>
          </div>
        )}

        {!bowUsed && (
          <div
            className="bio-game__bow-tip"
            style={{
              left: `${BIO_BOW_RECT.x - 2}%`,
              top: `${BIO_BOW_RECT.y + BIO_BOW_RECT.h * 0.15}%`,
            }}
            aria-hidden
          >
            <span className="bio-game__bow-tip-arrow">▸</span>
            <span className="bio-game__bow-tip-label">Use bow</span>
          </div>
        )}

        {scenePhase === 'apartment' && (
          <button
            type="button"
            className={`bio-game__hotspot bio-game__hotspot--bow${
              bowUsed ? ' bio-game__hotspot--ready' : ''
            }`}
            style={{
              left: `${BIO_BOW_RECT.x}%`,
              top: `${BIO_BOW_RECT.y}%`,
              width: `${BIO_BOW_RECT.w}%`,
              height: `${BIO_BOW_RECT.h}%`,
            }}
            aria-label="Bow — click to equip"
            onClick={handleBowClick}
          />
        )}

        {bowUsed && scenePhase === 'apartment' && (
          <button
            type="button"
            className="bio-game__shoot-btn"
            style={{
              left: `${BIO_BOW_RECT.x + BIO_BOW_RECT.w / 2}%`,
              top: `${BIO_BOW_RECT.y + BIO_BOW_RECT.h + 2}%`,
            }}
            onClick={handleStartShooting}
          >
            Start shooting
          </button>
        )}
      </div>
    </div>
  );
}
