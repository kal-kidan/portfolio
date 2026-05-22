import sceneImage from '@/assets/home/kals-portofolio-os.png';

export type DiskId =
  | 'bio'
  | 'experience'
  | 'projects'
  | 'skills'
  | 'contact'
  | 'resume';

export type SceneRect = {
  left: number;
  top: number;
  width: number;
  height: number;
};

export type PortfolioDisk = {
  id: DiskId;
  label: string;
  tagline: string;
  route: string;
  /** Position on the scene image (percent, 0–100) */
  position: SceneRect;
};

/** Scene asset — kals-portofolio-os.png (1672×941) */
export const SCENE_WIDTH = 1672;
export const SCENE_HEIGHT = 941;
export const SCENE_ASPECT = SCENE_WIDTH / SCENE_HEIGHT;
export const SCENE_IMAGE = sceneImage;

export const INSERT_DELAY_MS = 450;

/** Monitor icons — 2×3 grid on screen */
export const PORTFOLIO_DISKS: PortfolioDisk[] = [
  {
    id: 'bio',
    label: 'Bio',
    tagline: 'Get to know me',
    route: '/bio',
    position: { left: 35.2, top: 17.5, width: 5.2, height: 9.2 },
  },
  {
    id: 'experience',
    label: 'Experience',
    tagline: 'Level Up',
    route: '/experience',
    position: { left: 41.2, top: 17.5, width: 5.2, height: 9.2 },
  },
  {
    id: 'projects',
    label: 'Projects',
    tagline: 'New Game',
    route: '/projects',
    position: { left: 47.2, top: 17.5, width: 5.2, height: 9.2 },
  },
  {
    id: 'skills',
    label: 'Skills',
    tagline: 'Power Up',
    route: '/skills',
    position: { left: 35.2, top: 27.8, width: 5.2, height: 9.2 },
  },
  {
    id: 'contact',
    label: 'Contact',
    tagline: 'Connect',
    route: '/contact',
    position: { left: 41.2, top: 27.8, width: 5.2, height: 9.2 },
  },
  {
    id: 'resume',
    label: 'Resume',
    tagline: 'My resume',
    route: '/resume',
    position: { left: 47.2, top: 27.8, width: 5.2, height: 9.2 },
  },
];

/** Floppy disk drive — “INSERT DISK TO BEGIN” */
export const DISK_DRIVE_RECT: SceneRect = {
  left: 38.5,
  top: 35.8,
  width: 21,
  height: 6.5,
};

export const DROP_ZONE_IDS = ['disk-drive'] as const;

export const SECTION_META: Record<
  DiskId,
  { title: string; description: string }
> = {
  bio: {
    title: 'Bio',
    description: 'Get to know me — who I am and what I build.',
  },
  experience: {
    title: 'Experience',
    description: 'Level Up — roles, quests completed, and XP gained.',
  },
  projects: {
    title: 'Projects',
    description: 'New Game — shipped work and side quests.',
  },
  skills: {
    title: 'Skills',
    description: 'Power Up — abilities, stacks, and tooling.',
  },
  contact: {
    title: 'Contact',
    description: 'Connect — send a transmission.',
  },
  resume: {
    title: 'Resume',
    description: 'My resume — character sheet & career highlights.',
  },
};
