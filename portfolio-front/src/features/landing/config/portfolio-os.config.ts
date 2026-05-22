import sceneImage from '@/assets/home/kals-portofolio-os.png';
import bioDiscImage from '@/assets/home/dragged-imgs/bio-disc.png';
import contactDiscImage from '@/assets/home/dragged-imgs/contact-disc.png';
import experienceDiscImage from '@/assets/home/dragged-imgs/experience-disc.png';
import projectsDiscImage from '@/assets/home/dragged-imgs/projects-disc.png';
import resumeDiscImage from '@/assets/home/dragged-imgs/resume-disc.png';
import skillsDiscImage from '@/assets/home/dragged-imgs/skills-disc.png';
import type { PanInfo } from 'framer-motion';

/**
 * --------------------------------
 * SOURCE IMAGE
 * --------------------------------
 *
 * kals-portofolio-os.png
 * 1672 × 941
 *
 * All coordinates below are based on
 * source-image pixels.
 */

export const SCENE_WIDTH = 1672;
export const SCENE_HEIGHT = 941;
export const SCENE_ASPECT = SCENE_WIDTH / SCENE_HEIGHT;

export const SCENE_IMAGE = sceneImage;

export const INSERT_DELAY_MS = 450;

/**
 * --------------------------------
 * DISK TYPES
 * --------------------------------
 */

export type DiskId =
  | 'bio'
  | 'experience'
  | 'projects'
  | 'skills'
  | 'contact'
  | 'resume';

export const SHELF_DISK_ORDER: readonly DiskId[] = [
  'bio',
  'experience',
  'projects',
  'skills',
  'contact',
  'resume',
] as const;

/**
 * --------------------------------
 * SCENE RECT
 * --------------------------------
 */

export type SceneRect = {
  left: number;
  top: number;
  width: number;
  height: number;
};

/**
 * --------------------------------
 * PORTFOLIO DISK
 * --------------------------------
 */

export type PortfolioDisk = {
  id: DiskId;
  shelfIndex: number;
  discLabel: string;
  screenLabel: string;
  tagline: string;
  route: string;
  color: string;
  dragImage: string;
};

export const DISK_DRAG_IMAGES: Record<DiskId, string> = {
  bio: bioDiscImage,
  experience: experienceDiscImage,
  projects: projectsDiscImage,
  skills: skillsDiscImage,
  contact: contactDiscImage,
  resume: resumeDiscImage,
};

/**
 * --------------------------------
 * DISK HITBOXES
 * --------------------------------
 *
 * Source image coordinates.
 *
 * These are NOT percentages.
 * They scale dynamically at runtime.
 */

export type DiskHitbox = {
  id: DiskId;
  left: number;
  top: number;
  width: number;
  height: number;

  /**
   * Center point
   * Used for smooth nearest-disk snapping
   */
  centerX: number;
  centerY: number;
};

export const DISK_HITBOXES: readonly DiskHitbox[] = [
  {
    id: 'bio',
    left: 35,
    top: 230,
    width: 279,
    height: 86,
    centerX: 174,
    centerY: 246,
  },

  {
    id: 'experience',
    left: 35,
    top: 280,
    width: 279,
    height: 86,
    centerX: 174,
    centerY: 346,
  },

  {
    id: 'projects',
    left: 35,
    top: 374,
    width: 279,
    height: 86,
    centerX: 174,
    centerY: 417,
  },

  {
    id: 'skills',
    left: 35,
    top: 472,
    width: 279,
    height: 86,
    centerX: 174,
    centerY: 480,
  },

  {
    id: 'contact',
    left: 35,
    top: 568,
    width: 279,
    height: 86,
    centerX: 174,
    centerY: 550,
  },

  {
    id: 'resume',
    left: 35,
    top: 766,
    width: 279,
    height: 86,
    centerX: 174,
    centerY: 630,
  },
] as const;

/**
 * --------------------------------
 * INSERT DISK MODULE (left bay — "INSERT DISK TO BEGIN")
 * --------------------------------
 *
 * Panel: source px 528,648 → 760,760 on 1672×941
 * Slit:  source px 548,672 → 188×20 (narrow opening only)
 */

export const DISK_INSERT_PANEL_RECT: SceneRect = {
  left: 37.58,
  top: 73.86,
  width: 18.88,
  height: 8.9,
};

export const DISK_INSERT_SLIT_RECT: SceneRect = {
  left: 32.78,
  top: 71.41,
  width: 11.24,
  height: 2.13,
};

/** Drop target — full insert module (not the monitor slot) */
export const DISK_DRIVE_RECT = DISK_INSERT_PANEL_RECT;

/**
 * --------------------------------
 * DISK META
 * --------------------------------
 */

const DISK_META: Record<
  DiskId,
  Omit<PortfolioDisk, 'id' | 'shelfIndex' | 'dragImage'>
> = {
  bio: {
    discLabel: 'BIO.DISC',
    screenLabel: 'BIO',
    tagline: 'GET TO KNOW ME',
    route: '/bio',
    color: '#f472b6',
  },

  experience: {
    discLabel: 'EXPERIENCE.DISC',
    screenLabel: 'EXPERIENCE',
    tagline: 'LEVEL UP',
    route: '/experience',
    color: '#c084fc',
  },

  projects: {
    discLabel: 'PROJECTS.DISC',
    screenLabel: 'PROJECTS',
    tagline: 'NEW GAME',
    route: '/projects',
    color: '#fb923c',
  },

  skills: {
    discLabel: 'SKILLS.DISC',
    screenLabel: 'SKILLS',
    tagline: 'POWER UP',
    route: '/skills',
    color: '#4ade80',
  },

  contact: {
    discLabel: 'CONTACT.DISC',
    screenLabel: 'CONTACT',
    tagline: 'CONNECT',
    route: '/contact',
    color: '#f87171',
  },

  resume: {
    discLabel: 'RESUME.DISC',
    screenLabel: 'RESUME',
    tagline: 'MY RESUME',
    route: '/resume',
    color: '#818cf8',
  },
};

export const PORTFOLIO_DISKS: PortfolioDisk[] = SHELF_DISK_ORDER.map(
  (id, index) => ({
    id,
    shelfIndex: index + 1,
    dragImage: DISK_DRAG_IMAGES[id],
    ...DISK_META[id],
  }),
);

/**
 * --------------------------------
 * MOTION COLLISION DETECTION
 * --------------------------------
 *
 * Uses Framer Motion viewport coordinates:
 *
 * info.point.x
 * info.point.y
 *
 * This is MUCH more reliable than
 * raw mouse coordinates while dragging.
 */

export function getHoveredDiskIndex(
  pointX: number,
  pointY: number,
  sceneRect: DOMRect,
): number {
  /**
   * Convert viewport coordinates
   * into scene-local coordinates
   */

  const localX = pointX - sceneRect.left;
  const localY = pointY - sceneRect.top;

  /**
   * Current responsive scale
   */

  const scaleX = sceneRect.width / SCENE_WIDTH;
  const scaleY = sceneRect.height / SCENE_HEIGHT;

  /**
   * Find nearest disk center
   */

  let closestIndex = -1;
  let closestDistance = Infinity;

  for (let i = 0; i < DISK_HITBOXES.length; i++) {
    const disk = DISK_HITBOXES[i];

    const centerX = disk.centerX * scaleX;
    const centerY = disk.centerY * scaleY;

    const dx = localX - centerX;
    const dy = localY - centerY;

    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < closestDistance) {
      closestDistance = distance;
      closestIndex = i;
    }
  }

  /**
   * Prevent triggering outside rack
   */

  if (closestDistance > 140 * scaleY) {
    return -1;
  }

  return closestIndex;
}

/**
 * --------------------------------
 * MOTION HELPER
 * --------------------------------
 *
 * Direct helper for:
 *
 * onDrag={(_, info) => ...}
 */

export function getHoveredDiskFromPanInfo(
  info: PanInfo,
  sceneRect: DOMRect,
): PortfolioDisk | null {
  const index = getHoveredDiskIndex(info.point.x, info.point.y, sceneRect);

  if (index === -1) {
    return null;
  }

  return PORTFOLIO_DISKS[index];
}

/**
 * --------------------------------
 * SECTION META
 * --------------------------------
 */

export const SECTION_META: Record<
  DiskId,
  {
    title: string;
    discLabel: string;
    description: string;
  }
> = {
  bio: {
    title: 'Bio',
    discLabel: 'BIO.DISC',
    description: 'GET TO KNOW ME — who I am and what I build.',
  },

  experience: {
    title: 'Experience',
    discLabel: 'EXPERIENCE.DISC',
    description: 'LEVEL UP — roles, quests completed, and XP gained.',
  },

  projects: {
    title: 'Projects',
    discLabel: 'PROJECTS.DISC',
    description: 'NEW GAME — shipped work and side quests.',
  },

  skills: {
    title: 'Skills',
    discLabel: 'SKILLS.DISC',
    description: 'POWER UP — abilities, stacks, and tooling.',
  },

  contact: {
    title: 'Contact',
    discLabel: 'CONTACT.DISC',
    description: 'CONNECT — send a transmission.',
  },

  resume: {
    title: 'Resume',
    discLabel: 'RESUME.DISC',
    description: 'MY RESUME — character sheet & career highlights.',
  },
};
