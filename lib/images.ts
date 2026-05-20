"use client";

import { upload } from "@vercel/blob/client";

export function fileToDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const isBlobUrl = (v: string | null) =>
  !!v && /^https?:\/\//.test(v);

async function dataUrlToBlob(dataUrl: string): Promise<Blob> {
  const res = await fetch(dataUrl);
  return res.blob();
}

/**
 * Persist a profile image to Vercel Blob and return its public URL.
 *
 * - `null` → returns null (image removed).
 * - already an https URL (unchanged Blob URL) → returned as-is, no re-upload.
 * - a data URL (freshly picked) → uploaded under `users/<userId>/<name>`.
 */
export async function persistImage(
  userId: string,
  name: "photo" | "logo",
  value: string | null,
): Promise<string | null> {
  if (!value) return null;
  if (isBlobUrl(value)) return value;

  const blob = await dataUrlToBlob(value);
  const ext = blob.type === "image/png" ? "png" : blob.type === "image/webp" ? "webp" : "jpg";
  const result = await upload(`users/${userId}/${name}.${ext}`, blob, {
    access: "public",
    handleUploadUrl: "/api/profile/upload",
    contentType: blob.type || "image/jpeg",
  });
  return result.url;
}
