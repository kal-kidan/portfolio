import { forwardRef } from 'react';
import type { CSSProperties } from 'react';
import {
  DISK_INSERT_PANEL_RECT,
  DISK_INSERT_SLIT_RECT,
} from '../../config/portfolio-os.config';
import { rectToStyle } from './rectToStyle';

/** Slit rect relative to insert panel (scene % → panel-local %) */
function slitInPanelStyle(): CSSProperties {
  const p = DISK_INSERT_PANEL_RECT;
  const s = DISK_INSERT_SLIT_RECT;
  return {
    left: `${((s.left - p.left) / p.width) * 100}%`,
    top: `${((s.top - p.top) / p.height) * 100}%`,
    width: `${(s.width / p.width) * 100}%`,
    height: `${(s.height / p.height) * 100}%`,
  };
}

type DiskInsertSlotProps = {
  isDragging: boolean;
  isOver: boolean;
  inserting: boolean;
};

export const DiskInsertSlot = forwardRef<HTMLDivElement, DiskInsertSlotProps>(
  function DiskInsertSlot({ isDragging, isOver, inserting }, ref) {
    const active = isDragging && !inserting;
    const ready = active && isOver;

    return (
      <div
        ref={ref}
        className={[
          'portfolio-os-hotspot',
          'portfolio-os-insert',
          active ? 'portfolio-os-insert--active' : '',
          ready ? 'portfolio-os-insert--over' : '',
          inserting ? 'portfolio-os-insert--inserting' : '',
        ]
          .filter(Boolean)
          .join(' ')}
        style={rectToStyle(DISK_INSERT_PANEL_RECT)}
        aria-label="Insert disk slot"
      >
        <div
          className="portfolio-os-insert__frame"
          aria-hidden
        >
          <div
            className="portfolio-os-insert__slit"
            style={slitInPanelStyle()}
          />
          <span className="portfolio-os-insert__led" aria-hidden />
          <p className="portfolio-os-insert__hint" aria-hidden>
            {ready ? 'DROP DISK' : 'INSERT DISK TO BEGIN'}
          </p>
        </div>
      </div>
    );
  },
);
