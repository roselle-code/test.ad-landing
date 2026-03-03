// Carousel photo order follows Figma's circular path layout (left-to-right angular order).
// Reordering this array changes which photos appear in which positions.
// After reordering, you must recalculate INITIAL_ROTATION to center the desired photo.
export const PHOTOS = [
  "/placeholders/carousel-6.png",
  "/placeholders/carousel-5.png",
  "/placeholders/carousel-1.png",
  "/placeholders/carousel-4.png",
  "/placeholders/carousel-8.png",
  "/placeholders/carousel-2.png",
  "/placeholders/carousel-3.png",
  "/placeholders/carousel-7.png",
];

export const FEATURES = [
  {
    title: "Use It Like Any Smartphone",
    description:
      "A familiar OS that supports all your favorite apps. Scrolling, gaming, or snapping photos, it feels exactly like the premium device you are used to.",
  },
  {
    title: "It Contributes in the Background",
    description:
      "While you live your life, XForge quietly shares idle computing resources with a decentralized network. Zero impact on performance.",
  },
  {
    title: "You Earn Rewards & Perks",
    description:
      "Your participation generates real value. Earn reward points redeemable for perks, discounts, and exclusive benefits in the ecosystem.",
  },
];

export const RADIUS = 1100;
export const PHOTO_COUNT = PHOTOS.length;
export const ANGLE_STEP = 16;
export const START_ANGLE = -((PHOTO_COUNT - 1) / 2) * ANGLE_STEP;
// TOTAL_ROTATION: total degrees the wheel rotates during scroll (negative = counter-clockwise)
export const TOTAL_ROTATION = -36;
export const PHOTO_TOP_OFFSET = 60;
// INITIAL_ROTATION: degrees offset at page load. 40 centers the MOBA gaming photo (carousel-5.png).
// Formula: INITIAL_ROTATION ≈ index * ANGLE_STEP adjusted for which photo should be at 12 o'clock.
export const INITIAL_ROTATION = 40;

export function getPhotoStyle(index: number) {
  const angleDeg = START_ANGLE + index * ANGLE_STEP;
  const angleRad = (angleDeg * Math.PI) / 180;
  const x = RADIUS * Math.sin(angleRad);
  const y = RADIUS * (1 - Math.cos(angleRad));
  return {
    left: `calc(50% + ${x}px - 110px)`,
    top: `${y + PHOTO_TOP_OFFSET}px`,
    transform: `rotate(${angleDeg}deg)`,
  };
}
