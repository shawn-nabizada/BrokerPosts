import { put, head } from "@vercel/blob";
import type { Broker } from "@/types";
import { EMPTY_BROKER } from "@/types";

// Server-only helpers for reading/writing a broker profile in Vercel Blob.
// One JSON object per user, at a deterministic path keyed by the user id.

const profilePath = (userId: string) => `profiles/${userId}.json`;

/** Path prefix for a user's images (headshot, logo). */
export const userImagePath = (userId: string, name: string) =>
  `users/${userId}/${name}`;

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
