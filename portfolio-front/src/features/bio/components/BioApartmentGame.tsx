import { useCallback, useRef, useState } from 'react';
import apartmentImage from '@/assets/bio/standing-in-an-apartment.png';
import {
  BIO_BOARD_FACTS,
  BIO_BOW_RECT,
  BIO_WHITEBOARD_RECT,
} from '../config/bio-game.config';
import '../bio-game.css';

type BioApartmentGameProps = {
  className?: string;
  onStatusChange?: (message: string) => void;
};

type Shot = {
  id: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

export function BioApartmentGame({
  className = '',
  onStatusChange,
}: BioApartmentGameProps) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const [bowReady, setBowReady] = useState(false);
  const [factIndex, setFactIndex] = useState<number | null>(null);
  const [shot, setShot] = useState<Shot | null>(null);
  const shotId = useRef(0);

  const setStatus = useCallback(
    (msg: string) => onStatusChange?.(msg),
    [onStatusChange],
  );

  const scenePoint = useCallback((clientX: number, clientY: number) => {
    const el = sceneRef.current;
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return {
      x: ((clientX - r.left) / r.width) * 100,
      y: ((clientY - r.top) / r.height) * 100,
      px: clientX - r.left,
      py: clientY - r.top,
    };
  }, []);

  const inRect = (
    p: { x: number; y: number },
    rect: { x: number; y: number; w: number; h: number },
  ) =>
    p.x >= rect.x &&
    p.x <= rect.x + rect.w &&
    p.y >= rect.y &&
    p.y <= rect.y + rect.h;

  const bowCenter = {
    x: BIO_BOW_RECT.x + BIO_BOW_RECT.w / 2,
    y: BIO_BOW_RECT.y + BIO_BOW_RECT.h / 2,
  };

  const fireAtBoard = useCallback(() => {
    const board = BIO_WHITEBOARD_RECT;
    const targetX = board.x + board.w / 2;
    const targetY = board.y + board.h / 2;
    const id = ++shotId.current;
    setShot({
      id,
      x1: bowCenter.x,
      y1: bowCenter.y,
      x2: targetX,
      y2: targetY,
    });
    window.setTimeout(() => setShot((s) => (s?.id === id ? null : s)), 520);

    setFactIndex((i) => {
      const next = i === null ? 0 : (i + 1) % BIO_BOARD_FACTS.length;
      setStatus(`> Hit! ${BIO_BOARD_FACTS[next]}`);
      return next;
    });
  }, [bowCenter.x, bowCenter.y, setStatus]);

  const handleSceneClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const p = scenePoint(e.clientX, e.clientY);
      if (!p) return;

      if (inRect(p, BIO_BOW_RECT)) {
        setBowReady(true);
        setStatus('> Bow ready — click the whiteboard to shoot');
        return;
      }

      if (inRect(p, BIO_WHITEBOARD_RECT)) {
        if (!bowReady) {
          setStatus('> Grab the bow first, then shoot the whiteboard');
          return;
        }
        fireAtBoard();
        return;
      }
    },
    [bowReady, fireAtBoard, scenePoint, setStatus],
  );

  return (
    <div className={`bio-game ${className}`.trim()}>
      <div
        ref={sceneRef}
        className="bio-game__scene"
        onClick={handleSceneClick}
        role="presentation"
      >
        <img
          src={apartmentImage}
          alt="Kal in a cyberpunk apartment in Addis Ababa"
          className="bio-game__image"
          draggable={false}
        />

        <button
          type="button"
          className={`bio-game__hotspot bio-game__hotspot--bow${
            bowReady ? ' bio-game__hotspot--ready' : ''
          }`}
          style={{
            left: `${BIO_BOW_RECT.x}%`,
            top: `${BIO_BOW_RECT.y}%`,
            width: `${BIO_BOW_RECT.w}%`,
            height: `${BIO_BOW_RECT.h}%`,
          }}
          aria-label="Bow — click to ready, then shoot the whiteboard"
          onClick={(e) => {
            e.stopPropagation();
            setBowReady(true);
            setStatus('> Bow ready — click the whiteboard to shoot');
          }}
        />

        <button
          type="button"
          className={`bio-game__hotspot bio-game__hotspot--board${
            factIndex !== null ? ' bio-game__hotspot--hit' : ''
          }`}
          style={{
            left: `${BIO_WHITEBOARD_RECT.x}%`,
            top: `${BIO_WHITEBOARD_RECT.y}%`,
            width: `${BIO_WHITEBOARD_RECT.w}%`,
            height: `${BIO_WHITEBOARD_RECT.h}%`,
          }}
          aria-label="Whiteboard — shoot to learn about Kal"
          onClick={(e) => {
            e.stopPropagation();
            if (!bowReady) {
              setStatus('> Grab the bow first, then shoot the whiteboard');
              return;
            }
            fireAtBoard();
          }}
        />

        {shot && (
          <svg
            className="bio-game__arrow"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden
          >
            <line
              x1={shot.x1}
              y1={shot.y1}
              x2={shot.x2}
              y2={shot.y2}
            />
          </svg>
        )}

        {factIndex !== null && (
          <div
            className="bio-game__board-note"
            style={{
              left: `${BIO_WHITEBOARD_RECT.x}%`,
              top: `${BIO_WHITEBOARD_RECT.y}%`,
              width: `${BIO_WHITEBOARD_RECT.w}%`,
              height: `${BIO_WHITEBOARD_RECT.h}%`,
            }}
          >
            <p>{BIO_BOARD_FACTS[factIndex]}</p>
          </div>
        )}
      </div>
    </div>
  );
}
