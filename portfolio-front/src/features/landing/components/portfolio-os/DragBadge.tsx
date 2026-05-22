import type { CSSProperties } from 'react';
import type { PortfolioDisk } from '../../config/portfolio-os.config';

type DragBadgeProps = {
  disk: PortfolioDisk;
  x: number;
  y: number;
};

/** Floating label that follows the cursor during a shelf drag. */
export function DragBadge({ disk, x, y }: DragBadgeProps) {
  return (
    <div
      aria-hidden
      style={
        {
          '--disk-color': disk.color,
          position: 'fixed',
          left: x,
          top: y,
          transform: 'translate(-50%, -50%)',
          zIndex: 9999,
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '5px 10px',
          borderRadius: 3,
          border: '1px solid color-mix(in srgb, var(--disk-color) 50%, transparent)',
          background:
            'color-mix(in srgb, var(--disk-color) 22%, rgba(10,6,8,0.9))',
          boxShadow: '0 4px 14px rgba(0,0,0,0.5)',
          fontFamily: "ui-monospace, 'Courier New', monospace",
          fontSize: '0.58rem',
          fontWeight: 600,
          letterSpacing: '0.04em',
          color: 'rgba(240,240,245,0.97)',
          whiteSpace: 'nowrap',
          userSelect: 'none',
        } as CSSProperties
      }
    >
      <span
        style={{
          width: 7,
          height: 7,
          borderRadius: '50%',
          background: disk.color,
          flexShrink: 0,
        }}
      />
      {disk.discLabel}
    </div>
  );
}
