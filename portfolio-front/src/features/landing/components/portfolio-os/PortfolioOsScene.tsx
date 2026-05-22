import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DISK_DRIVE_RECT,
  INSERT_DELAY_MS,
  SCENE_ASPECT,
  SCENE_HEIGHT,
  SCENE_IMAGE,
  SCENE_WIDTH,
  type PortfolioDisk,
} from '../../config/portfolio-os.config';
import { DragBadge } from './DragBadge';
import { ShelfZone } from './ShelfZone';
import { rectToStyle } from './rectToStyle';
import './portfolio-os.css';

const IDLE_STATUS = '> Drag a floppy from the shelf into the drive slot…';

function isOverlapping(ax: number, ay: number, b: DOMRect): boolean {
  // Point-in-rect — pointer coords vs drive bounding rect
  return ax >= b.left && ax <= b.right && ay >= b.top && ay <= b.bottom;
}

type DragState = {
  disk: PortfolioDisk;
  pointerId: number;
  x: number;
  y: number;
};

export function PortfolioOsScene() {
  const navigate = useNavigate();
  const sceneRef = useRef<HTMLDivElement>(null);
  const driveRef = useRef<HTMLDivElement>(null);

  const [drag, setDrag] = useState<DragState | null>(null);
  const [driveHover, setDriveHover] = useState(false);
  const [inserting, setInserting] = useState(false);
  const [status, setStatus] = useState(IDLE_STATUS);

  const insertDisk = useCallback(
    (disk: PortfolioDisk) => {
      if (inserting) return;
      setInserting(true);
      setStatus(`> Loading ${disk.discLabel}…`);
      window.setTimeout(() => navigate(disk.route), INSERT_DELAY_MS);
    },
    [inserting, navigate],
  );

  const handleGrab = useCallback(
    (disk: PortfolioDisk, pointerId: number) => {
      if (inserting) return;
      setDrag({ disk, pointerId, x: 0, y: 0 });
      setStatus(`> Dragging ${disk.discLabel} — drop into the drive slot`);
    },
    [inserting],
  );

  useEffect(() => {
    if (!drag) return;

    const onMove = (e: PointerEvent) => {
      if (e.pointerId !== drag.pointerId) return;
      setDrag((d) => (d ? { ...d, x: e.clientX, y: e.clientY } : null));
      const driveRect = driveRef.current?.getBoundingClientRect();
      setDriveHover(
        driveRect ? isOverlapping(e.clientX, e.clientY, driveRect) : false,
      );
    };

    const onUp = (e: PointerEvent) => {
      if (e.pointerId !== drag.pointerId) return;
      const driveRect = driveRef.current?.getBoundingClientRect();
      const dropped =
        driveRect ? isOverlapping(e.clientX, e.clientY, driveRect) : false;

      setDrag(null);
      setDriveHover(false);

      if (dropped) {
        insertDisk(drag.disk);
      } else {
        setStatus(IDLE_STATUS);
      }
    };

    const onCancel = (e: PointerEvent) => {
      if (e.pointerId !== drag.pointerId) return;
      setDrag(null);
      setDriveHover(false);
      setStatus(IDLE_STATUS);
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onCancel);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onCancel);
    };
  }, [drag, insertDisk]);

  const isDragging = Boolean(drag);

  return (
    <div className="portfolio-os-scene-wrap">
      <div
        ref={sceneRef}
        className={`portfolio-os-scene${inserting ? ' portfolio-os-scene--inserting' : ''}`}
        style={{
          aspectRatio: SCENE_ASPECT,
          cursor: isDragging ? 'grabbing' : undefined,
        }}
      >
        <img
          className="portfolio-os-scene__bg"
          src={SCENE_IMAGE}
          alt="Kal's Portfolio OS — drag a floppy from the left shelf into the drive slot"
          width={SCENE_WIDTH}
          height={SCENE_HEIGHT}
          draggable={false}
        />

        {/* Drive drop zone — visual feedback only */}
        <div
          ref={driveRef}
          className={[
            'portfolio-os-hotspot',
            'portfolio-os-drop',
            isDragging ? 'portfolio-os-drop--active' : '',
            driveHover ? 'portfolio-os-drop--over' : '',
          ]
            .filter(Boolean)
            .join(' ')}
          style={rectToStyle(DISK_DRIVE_RECT)}
          aria-hidden
        />

        {/* Shelf hit area — detects which disk was grabbed by pointer Y */}
        <ShelfZone
          sceneRef={sceneRef}
          disabled={inserting}
          onGrab={handleGrab}
        />
      </div>

      {/* Floating badge that follows the cursor while dragging */}
      {drag && drag.x !== 0 && (
        <DragBadge disk={drag.disk} x={drag.x} y={drag.y} />
      )}

      <p
        className={`portfolio-os-status${isDragging ? ' portfolio-os-status--active' : ''}`}
        aria-live="polite"
      >
        {status}
      </p>
    </div>
  );
}
