export type FontDef = { family: string; category: string; weights?: number[] };

export const FONT_CATEGORIES = [
  "All",
  "Display",
  "Sans",
  "Serif",
  "Script",
  "Handwriting",
  "Mono",
  "Decorative",
  "Custom",
] as const;

export const GOOGLE_FONTS: FontDef[] = [
  { family: "Anton", category: "Display" },
  { family: "Bebas Neue", category: "Display" },
  { family: "Archivo Black", category: "Display" },
  { family: "Alfa Slab One", category: "Display" },
  { family: "Bungee", category: "Display" },
  { family: "Bungee Shade", category: "Display" },
  { family: "Bungee Inline", category: "Display" },
  { family: "Titan One", category: "Display" },
  { family: "Fredoka", category: "Display" },
  { family: "Luckiest Guy", category: "Display" },
  { family: "Rubik Mono One", category: "Display" },
  { family: "Russo One", category: "Display" },
  { family: "Passion One", category: "Display" },
  { family: "Righteous", category: "Display" },
  { family: "Bowlby One SC", category: "Display" },
  { family: "Ultra", category: "Display" },
  { family: "Chewy", category: "Display" },
  { family: "Lilita One", category: "Display" },
  { family: "Shrikhand", category: "Display" },
  { family: "Monoton", category: "Decorative" },
  { family: "Faster One", category: "Decorative" },
  { family: "Audiowide", category: "Decorative" },
  { family: "Orbitron", category: "Decorative" },
  { family: "Press Start 2P", category: "Decorative" },
  { family: "Silkscreen", category: "Decorative" },
  { family: "VT323", category: "Decorative" },
  { family: "Creepster", category: "Decorative" },
  { family: "Nosifer", category: "Decorative" },
  { family: "Eater", category: "Decorative" },
  { family: "Rubik Glitch", category: "Decorative" },
  { family: "Rubik Puddles", category: "Decorative" },
  { family: "Rubik Burned", category: "Decorative" },
  { family: "Rubik Wet Paint", category: "Decorative" },
  { family: "Pirata One", category: "Decorative" },
  { family: "UnifrakturMaguntia", category: "Decorative" },
  { family: "Metal Mania", category: "Decorative" },
  { family: "Special Elite", category: "Decorative" },
  { family: "Bangers", category: "Decorative" },
  { family: "Sedgwick Ave Display", category: "Decorative" },
  { family: "Codystar", category: "Decorative" },
  { family: "Inter", category: "Sans" },
  { family: "Poppins", category: "Sans" },
  { family: "Montserrat", category: "Sans" },
  { family: "Raleway", category: "Sans" },
  { family: "Oswald", category: "Sans" },
  { family: "Work Sans", category: "Sans" },
  { family: "DM Sans", category: "Sans" },
  { family: "Manrope", category: "Sans" },
  { family: "Outfit", category: "Sans" },
  { family: "Figtree", category: "Sans" },
  { family: "Sora", category: "Sans" },
  { family: "Urbanist", category: "Sans" },
  { family: "Space Grotesk", category: "Sans" },
  { family: "Plus Jakarta Sans", category: "Sans" },
  { family: "Nunito", category: "Sans" },
  { family: "Quicksand", category: "Sans" },
  { family: "Barlow", category: "Sans" },
  { family: "Cabin", category: "Sans" },
  { family: "Karla", category: "Sans" },
  { family: "Epilogue", category: "Sans" },
  { family: "Syne", category: "Sans" },
  { family: "Chakra Petch", category: "Sans" },
  { family: "Exo 2", category: "Sans" },
  { family: "Playfair Display", category: "Serif" },
  { family: "Merriweather", category: "Serif" },
  { family: "Lora", category: "Serif" },
  { family: "Libre Baskerville", category: "Serif" },
  { family: "Cormorant Garamond", category: "Serif" },
  { family: "EB Garamond", category: "Serif" },
  { family: "Bodoni Moda", category: "Serif" },
  { family: "DM Serif Display", category: "Serif" },
  { family: "Instrument Serif", category: "Serif" },
  { family: "Abril Fatface", category: "Serif" },
  { family: "Yeseva One", category: "Serif" },
  { family: "Prata", category: "Serif" },
  { family: "Cinzel", category: "Serif" },
  { family: "Cinzel Decorative", category: "Serif" },
  { family: "Spectral", category: "Serif" },
  { family: "Crimson Text", category: "Serif" },
  { family: "Pacifico", category: "Script" },
  { family: "Lobster", category: "Script" },
  { family: "Great Vibes", category: "Script" },
  { family: "Dancing Script", category: "Script" },
  { family: "Sacramento", category: "Script" },
  { family: "Parisienne", category: "Script" },
  { family: "Allura", category: "Script" },
  { family: "Alex Brush", category: "Script" },
  { family: "Tangerine", category: "Script" },
  { family: "Yellowtail", category: "Script" },
  { family: "Satisfy", category: "Script" },
  { family: "Cookie", category: "Script" },
  { family: "Marck Script", category: "Script" },
  { family: "Kaushan Script", category: "Script" },
  { family: "Italianno", category: "Script" },
  { family: "Mrs Saint Delafield", category: "Script" },
  { family: "Caveat", category: "Handwriting" },
  { family: "Indie Flower", category: "Handwriting" },
  { family: "Shadows Into Light", category: "Handwriting" },
  { family: "Permanent Marker", category: "Handwriting" },
  { family: "Architects Daughter", category: "Handwriting" },
  { family: "Patrick Hand", category: "Handwriting" },
  { family: "Gloria Hallelujah", category: "Handwriting" },
  { family: "Amatic SC", category: "Handwriting" },
  { family: "Rock Salt", category: "Handwriting" },
  { family: "Nanum Pen Script", category: "Handwriting" },
  { family: "Homemade Apple", category: "Handwriting" },
  { family: "Just Another Hand", category: "Handwriting" },
  { family: "Reenie Beanie", category: "Handwriting" },
  { family: "JetBrains Mono", category: "Mono" },
  { family: "Space Mono", category: "Mono" },
  { family: "IBM Plex Mono", category: "Mono" },
  { family: "Roboto Mono", category: "Mono" },
  { family: "Fira Code", category: "Mono" },
  { family: "Source Code Pro", category: "Mono" },
  { family: "Courier Prime", category: "Mono" },
  { family: "Share Tech Mono", category: "Mono" },
];

const loaded = new Set<string>();

/** Injects a Google Fonts stylesheet for the family (once) and waits for it. */
export async function loadGoogleFont(family: string): Promise<void> {
  if (typeof document === "undefined") return;
  if (loaded.has(family)) return;
  loaded.add(family);
  const href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
    family,
  ).replace(/%20/g, "+")}:wght@100;200;300;400;500;600;700;800;900&display=swap`;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  document.head.appendChild(link);
  try {
    await document.fonts.load(`400 32px "${family}"`);
    await document.fonts.load(`700 32px "${family}"`);
  } catch {
    /* ignore */
  }
}

const CUSTOM_KEY = "fontastic.customFonts.v1";

export type CustomFont = { family: string; dataUrl: string };

export function readCustomFonts(): CustomFont[] {
  if (typeof localStorage === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(CUSTOM_KEY) ?? "[]") as CustomFont[];
  } catch {
    return [];
  }
}

export function saveCustomFonts(fonts: CustomFont[]) {
  try {
    localStorage.setItem(CUSTOM_KEY, JSON.stringify(fonts));
  } catch {
    /* quota */
  }
}

export async function registerCustomFont(font: CustomFont) {
  if (typeof document === "undefined") return;
  try {
    const face = new FontFace(font.family, `url(${font.dataUrl})`);
    await face.load();
    document.fonts.add(face);
  } catch {
    /* ignore */
  }
}

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
