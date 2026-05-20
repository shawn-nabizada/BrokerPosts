import { put, head } from "@vercel/blob";
import type { Broker } from "@/types";
import { EMPTY_BROKER } from "@/types";

// Server-only helpers for reading/writing a broker profile in Vercel Blob.
// One JSON object per user, at a deterministic path keyed by the user id.

const profilePath = (userId: string) => `profiles/${userId}.json`;

/**
 * Read a user's profile. Returns null if they have none yet.
 *
 * The JSON blob is stored public with a deterministic pathname, so we resolve
 * its URL via `head()` and fetch it. `head()` throws when the blob is missing.
 */
export async function readProfile(userId: string): Promise<Broker | null> {
  try {
    const meta = await head(profilePath(userId));
    const res = await fetch(meta.url, { cache: "no-store" });
    if (!res.ok) return null;
    const data = (await res.json()) as Partial<Broker>;
    // Merge over defaults so older/partial blobs stay valid.
    return { ...EMPTY_BROKER, ...data };
  } catch {
    return null;
  }
}

/** Create or overwrite a user's profile JSON. */
export async function writeProfile(
  userId: string,
  broker: Broker,
): Promise<void> {
  await put(profilePath(userId), JSON.stringify(broker), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 0,
  });
}

const DATA_URL_RE = /^data:([^;]+);base64,(.+)$/s;

/**
 * Resolve a profile image field to a stored Blob URL.
 * - `null` → null (removed)
 * - already a remote URL (unchanged) → returned as-is
 * - a base64 data URL → decoded and uploaded to `users/<userId>/<name>`
 *
 * Throws on malformed input or upload failure so the caller can report it.
 */
export async function resolveProfileImage(
  userId: string,
  name: "photo" | "logo",
  value: string | null,
): Promise<string | null> {
  if (!value) return null;
  if (/^https?:\/\//.test(value)) return value;

  const match = DATA_URL_RE.exec(value);
  if (!match) throw new Error(`Invalid image data for ${name}`);

  const contentType = match[1];
  const buffer = Buffer.from(match[2], "base64");
  const ext = contentType.includes("png")
    ? "png"
    : contentType.includes("jpeg")
      ? "jpg"
      : contentType.includes("webp")
        ? "webp"
        : "bin";

  const { url } = await put(`users/${userId}/${name}.${ext}`, buffer, {
    access: "public",
    contentType,
    addRandomSuffix: true,
  });
  return url;
}
