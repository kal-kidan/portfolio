import type { PortfolioDisk } from '../../config/portfolio-os.config';

type DragBadgeProps = {
  disk: PortfolioDisk;
  x: number;
  y: number;
};

/** Floppy disc image that follows the cursor during a shelf drag. */
export function DragBadge({ disk, x, y }: DragBadgeProps) {
  return (
    <img
      className="portfolio-os-drag-disc"
      src={disk.dragImage}
      alt={disk.discLabel}
      draggable={false}
      style={{
        left: x,
        top: y,
      }}
    />
  );
}
