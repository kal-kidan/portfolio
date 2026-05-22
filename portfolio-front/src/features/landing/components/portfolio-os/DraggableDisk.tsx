import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import type { CSSProperties } from 'react';
import type { PortfolioDisk } from '../../config/portfolio-os.config';
import { rectToStyle } from './rectToStyle';

type DraggableDiskProps = {
  disk: PortfolioDisk;
  disabled?: boolean;
  onActivate: (disk: PortfolioDisk) => void;
};

export function DraggableDisk({
  disk,
  disabled,
  onActivate,
}: DraggableDiskProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: disk.id,
      disabled,
    });

  const style: CSSProperties = {
    ...rectToStyle(disk.position),
    transform: CSS.Translate.toString(transform),
  };

  return (
    <button
      type="button"
      ref={setNodeRef}
      className={`portfolio-os-hotspot portfolio-os-disk${isDragging ? ' portfolio-os-disk--dragging' : ''}`}
      style={style}
      disabled={disabled}
      aria-label={`${disk.label} disk. Drag to the CD drive or press Enter to open.`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onActivate(disk);
        }
      }}
      {...listeners}
      {...attributes}
    >
      <span className="portfolio-os-disk__label">
        {disk.label} — {disk.tagline}
      </span>
    </button>
  );
}
