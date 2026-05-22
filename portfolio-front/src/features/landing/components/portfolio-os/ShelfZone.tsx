import {
  DISK_HITBOXES,
  getHoveredDiskIndex,
  PORTFOLIO_DISKS,
  SCENE_HEIGHT,
  SCENE_WIDTH,
  type PortfolioDisk,
} from '../../config/portfolio-os.config';

type ShelfZoneProps = {
  sceneRef: React.RefObject<HTMLDivElement | null>;
  disabled: boolean;
  onGrab: (disk: PortfolioDisk, pointerId: number) => void;
};

/**
 * One invisible target per disk, sized from DISK_HITBOXES.
 * Grab resolves via getHoveredDiskIndex (nearest center within rack).
 */
export function ShelfZone({ sceneRef, disabled, onGrab }: ShelfZoneProps) {
  const handlePointerDown = (e: React.PointerEvent) => {
    if (disabled) return;
    const scene = sceneRef.current?.getBoundingClientRect();
    if (!scene) return;

    const index = getHoveredDiskIndex(e.clientX, e.clientY, scene);
    if (index < 0) return;

    onGrab(PORTFOLIO_DISKS[index], e.pointerId);
  };

  return (
    <>
      {DISK_HITBOXES.map((box) => (
        <div
          key={box.id}
          onPointerDown={handlePointerDown}
          style={{
            position: 'absolute',
            left: `${(box.left / SCENE_WIDTH) * 100}%`,
            top: `${(box.top / SCENE_HEIGHT) * 100}%`,
            width: `${(box.width / SCENE_WIDTH) * 100}%`,
            height: `${(box.height / SCENE_HEIGHT) * 100}%`,
            cursor: disabled ? 'default' : 'grab',
            zIndex: 20,
            touchAction: 'none',
            WebkitUserSelect: 'none',
            userSelect: 'none',
          }}
          aria-label={PORTFOLIO_DISKS.find((d) => d.id === box.id)?.discLabel}
        />
      ))}
    </>
  );
}
