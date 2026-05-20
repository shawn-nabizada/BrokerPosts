import type { Kind, LayoutId, StyleId } from "@/types";

export const STYLE_IDS: StyleId[] = ["classic", "modern", "editorial"];
export const LAYOUT_IDS: LayoutId[] = ["hero", "grille", "mosaique"];

export const STYLE_META: Record<StyleId, { label: string; desc: string }> = {
  classic: { label: "Classique", desc: "Sérif élégant · cachet de cire" },
  modern: { label: "Moderne", desc: "Sans-serif gras · titre démesuré" },
  editorial: { label: "Éditorial", desc: "Magazine · titre démesuré" },
};

export const LAYOUT_META: Record<LayoutId, { label: string; desc: string }> = {
  hero: { label: "Hero", desc: "Une photo dominante" },
  grille: { label: "Grille", desc: "Mosaïque équilibrée" },
  mosaique: { label: "Mosaïque", desc: "Composition asymétrique" },
};

export const KIND_LABEL: Record<Kind, string> = {
  vendu: "VENDU",
  achete: "ACHETÉ",
};

export interface GridConf {
  areas: string;
  cols: string;
  rows: string;
}

// Each entry describes a CSS grid that fits N photo cells named "a","b","c"...
export const LAYOUT_GRIDS: Record<LayoutId, Record<number, GridConf>> = {
  hero: {
    3: { areas: `"a a" "a a" "b c"`, cols: "1fr 1fr", rows: "1fr 1fr 1fr" },
    4: {
      areas: `"a a b" "a a c" "a a d"`,
      cols: "1fr 1fr 1fr",
      rows: "1fr 1fr 1fr",
    },
    5: {
      areas: `"a a b" "a a c" "d e e"`,
      cols: "1fr 1fr 1fr",
      rows: "1fr 1fr 1fr",
    },
  },
  grille: {
    // 2 on top, 1 wide bottom — all cells landscape
    3: { areas: `"a b" "c c"`, cols: "1fr 1fr", rows: "1fr 1fr" },
    // classic 2×2
    4: { areas: `"a b" "c d"`, cols: "1fr 1fr", rows: "1fr 1fr" },
    // 2-2-1 with the last photo wide on the bottom
    5: { areas: `"a b" "c d" "e e"`, cols: "1fr 1fr", rows: "1fr 1fr 1fr" },
  },
  mosaique: {
    3: { areas: `"a b" "a c"`, cols: "1.4fr 1fr", rows: "1fr 1fr" },
    4: {
      areas: `"a a b" "c d b"`,
      cols: "1fr 1fr 1.1fr",
      rows: "1.4fr 1fr",
    },
    5: {
      areas: `"a a b" "a a c" "d e c"`,
      cols: "1fr 1fr 1.1fr",
      rows: "1fr 1fr 1fr",
    },
  },
};
