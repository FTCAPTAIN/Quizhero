import { PresetWallpaper } from "../types";

export const presetWallpapers: PresetWallpaper[] = [
  {
    id: 'plain-black',
    nameKey: 'wallpaper_plain_black_name',
    descriptionKey: 'wallpaper_plain_black_desc',
    style: { background: '#000000' },
    accentColor: '#06b6d4', // Cyan
  },
  {
    id: 'minimal-grey',
    nameKey: 'wallpaper_minimal_grey_name',
    descriptionKey: 'wallpaper_minimal_grey_desc',
    style: { background: 'linear-gradient(135deg, #4b5563, #1f2937)' },
    accentColor: '#f59e0b', // Amber
  },
  {
    id: 'dark-gradient',
    nameKey: 'wallpaper_dark_gradient_name',
    descriptionKey: 'wallpaper_dark_gradient_desc',
    style: { background: 'linear-gradient(to bottom right, #0c2a5d, #030712)' },
    accentColor: '#3b82f6', // Blue
  },
  {
    id: 'abstract-waves',
    nameKey: 'wallpaper_abstract_waves_name',
    descriptionKey: 'wallpaper_abstract_waves_desc',
    style: { background: 'linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)' },
    accentColor: '#84fab0',
  },
  {
    id: 'forest',
    nameKey: 'wallpaper_forest_name',
    descriptionKey: 'wallpaper_forest_desc',
    style: { background: 'linear-gradient(to bottom, #166534, #14532d)' },
    accentColor: '#22c55e', // Green
  },
  {
    id: 'night-sky',
    nameKey: 'wallpaper_night_sky_name',
    descriptionKey: 'wallpaper_night_sky_desc',
    style: {
      backgroundColor: '#0c0a09',
      backgroundImage: `radial-gradient(white, rgba(255,255,255,.2) 1px, transparent 20px),
                      radial-gradient(white, rgba(255,255,255,.15) 0.5px, transparent 15px)`,
      backgroundSize: '200px 200px, 100px 100px',
      backgroundPosition: '0 0, 30px 40px',
    },
    accentColor: '#a855f7', // Purple
  },
  {
    id: 'marble',
    nameKey: 'wallpaper_marble_name',
    descriptionKey: 'wallpaper_marble_desc',
    style: {
      backgroundColor: '#ffffff',
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4af37' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
    },
    accentColor: '#d4af37', // Gold
  },
  {
    id: 'wood',
    nameKey: 'wallpaper_wood_name',
    descriptionKey: 'wallpaper_wood_desc',
    style: {
      backgroundColor: '#854d0e',
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cg fill='%23522c04' fill-opacity='0.4'%3E%3Cpath fill-rule='evenodd' d='M0 0h40v40H0V0zm40 40h40v40H40V40z'/%3E%3C/g%3E%3C/svg%3E")`,
    },
    accentColor: '#f97316', // Orange
  },
];