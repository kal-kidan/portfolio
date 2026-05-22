import { useDroppable } from '@dnd-kit/core';
import type { SceneRect } from '../../config/portfolio-os.config';
import { rectToStyle } from './rectToStyle';

type CdDropZoneProps = {
  id: string;
  rect: SceneRect;
  label: string;
};

export function CdDropZone({ id, rect, label }: CdDropZoneProps) {
  const { isOver, setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`portfolio-os-hotspot portfolio-os-drop portfolio-os-drop--active${isOver ? ' portfolio-os-drop--over' : ''}`}
      style={rectToStyle(rect)}
      aria-label={label}
    />
  );
}
