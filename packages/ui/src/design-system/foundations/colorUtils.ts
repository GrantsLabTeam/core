import { grantsStackUIKit } from "@gitcoin/themes/colors";

export type Scale = Record<string, string>;

export const scaleNames = ["grey", "moss", "blue", "green", "red", "yellow", "purple"] as const;

export const scales = Object.fromEntries(
  scaleNames.map((name) => [name, grantsStackUIKit[name] as Scale]),
) as Record<(typeof scaleNames)[number], Scale>;

/** Number of primitive color tokens, including black and white. */
export const primitiveCountWithBase =
  scaleNames.reduce((sum, name) => sum + Object.keys(scales[name]).length, 0) + 2;

/** Maps a hex value back to its primitive token name, e.g. "#4B5050" -> "grey-900". */
export const tokenNameForHex = (hex: string): string | undefined => {
  const target = hex.toLowerCase();
  if (target === "#000000") return "black";
  if (target === "#ffffff") return "white";
  for (const name of scaleNames) {
    for (const [shade, value] of Object.entries(scales[name])) {
      if (value.toLowerCase() === target) return `${name}-${shade}`;
    }
  }
  return undefined;
};

const channel = (c: number) => {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
};

const luminance = (hex: string) => {
  const n = parseInt(hex.replace("#", ""), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
};

/** WCAG 2.1 contrast ratio between two hex colors. */
export const contrastRatio = (a: string, b: string) => {
  const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
};

export type WcagLevel = "AAA" | "AA" | "AA Large" | "Fail";

export const wcagLevel = (ratio: number): WcagLevel => {
  if (ratio >= 7) return "AAA";
  if (ratio >= 4.5) return "AA";
  if (ratio >= 3) return "AA Large";
  return "Fail";
};

/** Picks black or white text for legibility on a given background. */
export const onColor = (hex: string) =>
  contrastRatio(hex, "#000000") >= contrastRatio(hex, "#ffffff") ? "#000000" : "#ffffff";
