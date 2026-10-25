export const WALLPAPER_SECTIONS = [
  { id: "desktop", title: "Desktop" },
];

export const WALLPAPERS = [
  {
    id: "san-francisco-bay",
    category: "desktop",
    label: "San Francisco Bay",
    url: "/wallpapers/san-francisco-bay.jpg",
  },
  {
    id: "iceland-coast",
    category: "desktop",
    label: "Iceland Coast",
    url: "/wallpapers/iceland-coast.jpg",
  },
];

export function frameStyleFromUrl(url) {
  return {
    backgroundImage: `url("${url}")`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };
}

export function getWallpaperById(id) {
  return WALLPAPERS.find((w) => w.id === id) ?? WALLPAPERS[0];
}
