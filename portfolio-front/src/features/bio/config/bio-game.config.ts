/** Hit areas on standing-in-an-apartment.png (percent of image) */
export const BIO_BOW_RECT = { x: 78, y: 48, w: 16, h: 38 };
export const BIO_WHITEBOARD_RECT = { x: 11, y: 26, w: 22, h: 24 };

export const BIO_INTRO =
  'Hi, I am Kal. Backend-focused full-stack engineer based in Addis.';

/** Intro card entrance (matches bio-page.css animation-delay) */
export const BIO_INTRO_CARD_DELAY_MS = 400;
export const BIO_INTRO_CARD_ANIM_MS = 550;
/** Pause after intro is visible — time to read before the tip card */
export const BIO_INTRO_READ_MS = 3250;

export const BIO_TIP =
  'Use the bow in the room to shoot the whiteboard and discover more about me.';

/** Target on pointing-bow-to-the-white-board.png (% of image) — crowned lion emblem */
export const BIO_CROW_TARGET = { x: 68.5, y: 23.5 };

/**
 * bow.png arrow on the aiming scene — tail at draw hand, tip toward the board.
 * Percents are relative to the 1536×1024 aiming frame.
 */
export const BIO_BOW_OVERLAY = {
  /** Draw hand — arrow nock / fletching end */
  anchorX: 23,
  anchorY: 38.5,
  /** Tail position inside bow.png (sampled from asset) */
  tailX: 9.57,
  tailY: 62.6,
  scale: 0.28,
  rotate: 14,
};

export const BIO_AIM_STATUS = 'Aim at the crow';

/** Apartment → combat cam scene transition */
export const BIO_SCENE_CUT_MS = 1400;

/** Revealed on the board, one per successful shot */
export const BIO_BOARD_FACTS = [
  'Backend-first — APIs, data models, and reliable services.',
  'Full-stack — React / TypeScript on the surface, Node under the hood.',
  'Based in Addis Ababa — building for local and global teams.',
  'I ship end-to-end: design → deploy → iterate.',
  'Ask me about system design, DX, and clean architecture.',
];
