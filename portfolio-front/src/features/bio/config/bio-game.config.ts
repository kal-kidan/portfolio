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

/** Revealed on the board, one per successful shot */
export const BIO_BOARD_FACTS = [
  'Backend-first — APIs, data models, and reliable services.',
  'Full-stack — React / TypeScript on the surface, Node under the hood.',
  'Based in Addis Ababa — building for local and global teams.',
  'I ship end-to-end: design → deploy → iterate.',
  'Ask me about system design, DX, and clean architecture.',
];
