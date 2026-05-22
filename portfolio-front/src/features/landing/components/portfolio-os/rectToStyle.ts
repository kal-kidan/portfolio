import type { CSSProperties } from 'react';
import type { SceneRect } from '../../config/portfolio-os.config';

export function rectToStyle(rect: SceneRect): CSSProperties {
  return {
    left: `${rect.left}%`,
    top: `${rect.top}%`,
    width: `${rect.width}%`,
    height: `${rect.height}%`,
  };
}
