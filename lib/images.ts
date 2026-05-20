"use client";

// Client-side image helpers. Images are downscaled in the browser and sent as
// data URLs in the profile save request; the server uploads them to Vercel Blob.
// This avoids the fragile client-upload completion-callback handshake.

export function fileToDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

const isRemoteUrl = (v: string | null) => !!v && /^https?:\/\//.test(v);

/**
 * Downscale a data-URL image to fit within `maxDim` and re-encode it to WebP
 * (with alpha, so logos keep transparency). Falls back to PNG if the browser
 * can't encode WebP from a canvas (older Safari).
 */
async function downscale(
  dataUrl: string,
  maxDim: number,
  quality: number,
): Promise<string> {
  const img = await loadImage(dataUrl);
  let { width, height } = img;
  if (!width || !height) return dataUrl;

  const scale = Math.min(1, maxDim / Math.max(width, height));
  width = Math.round(width * scale);
  height = Math.round(height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return dataUrl;
  ctx.drawImage(img, 0, 0, width, height);

  const webp = canvas.toDataURL("image/webp", quality);
  // Browsers that don't support WebP encoding return a PNG data URL instead.
  return webp.startsWith("data:image/webp") ? webp : canvas.toDataURL("image/png");
}

/**
 * Prepare a profile image for saving:
 * - `null` → null (removed)
 * - already a remote Blob URL (unchanged) → returned as-is
 * - a freshly-picked data URL → downscaled + re-encoded WebP data URL
 */
export async function prepareImage(
  value: string | null,
  kind: "photo" | "logo",
): Promise<string | null> {
  if (!value) return null;
  if (isRemoteUrl(value)) return value;
  try {
    // Logo: smaller max, higher quality to keep edges/text crisp.
    return kind === "logo"
      ? await downscale(value, 600, 0.92)
      : await downscale(value, 720, 0.82);
  } catch {
    // If canvas processing fails for any reason, fall back to the original.
    return value;
  }
}
