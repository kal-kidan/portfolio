import { useCallback, useState } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { useNavigate } from 'react-router-dom';
import {
  DISK_DRIVE_RECT,
  DROP_ZONE_IDS,
  INSERT_DELAY_MS,
  PORTFOLIO_DISKS,
  SCENE_ASPECT,
  SCENE_HEIGHT,
  SCENE_IMAGE,
  SCENE_WIDTH,
  type PortfolioDisk,
} from '../../config/portfolio-os.config';
import { CdDropZone } from './CdDropZone';
import { DraggableDisk } from './DraggableDisk';
import './portfolio-os.css';

export function PortfolioOsScene() {
  const navigate = useNavigate();
  const [activeDisk, setActiveDisk] = useState<PortfolioDisk | null>(null);
  const [inserting, setInserting] = useState(false);
  const [status, setStatus] = useState('> Drag a disk into the drive…');

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 120, tolerance: 6 },
    }),
  );

  const insertDisk = useCallback(
    (disk: PortfolioDisk) => {
      if (inserting) return;
      setInserting(true);
      setStatus(`> Loading ${disk.label.toUpperCase()}…`);
      window.setTimeout(() => {
        navigate(disk.route);
      }, INSERT_DELAY_MS);
    },
    [inserting, navigate],
  );

  const handleDragStart = (event: DragStartEvent) => {
    const disk = PORTFOLIO_DISKS.find((d) => d.id === event.active.id);
    setActiveDisk(disk ?? null);
    setStatus('> Insert disk into drive…');
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveDisk(null);
    const { active, over } = event;

    if (
      !over ||
      !DROP_ZONE_IDS.includes(over.id as (typeof DROP_ZONE_IDS)[number])
    ) {
      setStatus('> Drag a disk into the drive…');
      return;
    }

    const disk = PORTFOLIO_DISKS.find((d) => d.id === active.id);
    if (disk) insertDisk(disk);
  };

  const handleDragCancel = () => {
    setActiveDisk(null);
    setStatus('> Drag a disk into the drive…');
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div
        className={`portfolio-os-scene${inserting ? ' portfolio-os-scene--inserting' : ''}`}
        style={{ aspectRatio: SCENE_ASPECT }}
      >
        <img
          className="portfolio-os-scene__bg"
          src={SCENE_IMAGE}
          alt="Kal's Portfolio OS — retro desk with monitor, floppy disks, and disk drive"
          width={SCENE_WIDTH}
          height={SCENE_HEIGHT}
          draggable={false}
        />

        <CdDropZone
          id="disk-drive"
          rect={DISK_DRIVE_RECT}
          label="Insert disk to begin"
        />

        {PORTFOLIO_DISKS.map((disk) => (
          <DraggableDisk
            key={disk.id}
            disk={disk}
            disabled={inserting}
            onActivate={insertDisk}
          />
        ))}

        <p className="portfolio-os-status" aria-live="polite">
          {status}
        </p>
      </div>

      <DragOverlay dropAnimation={null}>
        {activeDisk ? (
          <div
            className="portfolio-os-drag-overlay"
            style={{ width: 52, height: 52 }}
            aria-hidden
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
