// Shared domain types.

export type Kind = "vendu" | "achete";

export type StyleId = "classic" | "modern" | "editorial";

export type LayoutId = "hero" | "grille" | "mosaique";

export interface PhotoCrop {
  x: number;
  y: number;
  zoom: number;
}

export interface Broker {
  /** Broker headshot — a Vercel Blob URL once saved. */
  photo: string | null;
  photoCrop: PhotoCrop;
  name: string;
  title: string;
  email: string;
  phone: string;
  /** Agency / brokerage name — shown in caption only, never on the post. */
  agency: string;
  /** Agency logo — a Vercel Blob URL once saved. */
  logo: string | null;
}

export const EMPTY_BROKER: Broker = {
  photo: null,
  photoCrop: { x: 0, y: 0, zoom: 1 },
  name: "",
  title: "",
  email: "",
  phone: "",
  agency: "",
  logo: null,
};
