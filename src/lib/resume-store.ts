import { BlobNotFoundError, head, put, type HeadBlobResult } from "@vercel/blob";

/**
 * Fixed pathname so the stored resume is always overwritten in place rather
 * than piling up copies. Nothing else in the store shares this prefix.
 */
export const RESUME_PATHNAME = "resume/ashay-tamrakar-resume.pdf";

/** Vercel caps serverless request bodies at ~4.5MB, so stay under it. */
export const MAX_RESUME_BYTES = 4 * 1024 * 1024;

/**
 * The blob URL never changes, so the CDN would happily serve a stale resume
 * for a month (the default) after a replace. 60s is the lowest allowed.
 */
const CACHE_SECONDS = 60;

export async function getStoredResume(): Promise<HeadBlobResult | null> {
  try {
    return await head(RESUME_PATHNAME);
  } catch (error) {
    if (error instanceof BlobNotFoundError) return null;
    throw error;
  }
}

export async function storeResume(file: File) {
  return put(RESUME_PATHNAME, file, {
    access: "public",
    contentType: "application/pdf",
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: CACHE_SECONDS,
  });
}

/**
 * Trusting the browser-supplied content type would let anyone holding the
 * password park arbitrary content on the domain, so check the actual header.
 */
export async function looksLikePdf(file: File): Promise<boolean> {
  const header = new Uint8Array(await file.slice(0, 5).arrayBuffer());
  return (
    header.length === 5 &&
    header[0] === 0x25 && // %
    header[1] === 0x50 && // P
    header[2] === 0x44 && // D
    header[3] === 0x46 && // F
    header[4] === 0x2d //  -
  );
}
