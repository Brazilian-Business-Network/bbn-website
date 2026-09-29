import "server-only";

import { v2 as cloudinary } from "cloudinary";

/**
 * Server-only Cloudinary read layer for the events gallery.
 *
 * Design rule: this module NEVER throws. Media is nice-to-have, so a missing
 * credential or a Cloudinary outage degrades to an empty array and the UI falls
 * back to its gold-outlined placeholder states. `npm run build` therefore works
 * on a clean checkout with no .env.local at all.
 */

export type CloudMedia = {
  publicId: string;
  width: number;
  height: number;
  format: string;
  resourceType: "image" | "video";
  createdAt: string;
  /** EXIF capture time as ISO, when the file still carries EXIF. */
  capturedAt: string | null;
  /** Cloudinary display name — for camera files, the frame number (440A7379…). */
  displayName: string;
};

/** Root folder that holds one sub-folder per edition. */
const EVENTS_ROOT = "bbn/eventos";

/** Search API page size cap. */
const MAX_RESULTS = 500;

type Credentials = {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
};

function readCredentials(): Credentials | null {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) return null;

  return { cloudName, apiKey, apiSecret };
}

/**
 * True only when all three credentials are present. Callers use this to decide
 * whether to render media or an intentional placeholder — never to decide
 * whether it is safe to call the functions below (they are always safe).
 */
export function isCloudinaryConfigured(): boolean {
  return readCredentials() !== null;
}

/** Configures the v2 singleton and returns it, or null when unconfigured. */
function getClient(): typeof cloudinary | null {
  const credentials = readCredentials();
  if (!credentials) return null;

  cloudinary.config({
    cloud_name: credentials.cloudName,
    api_key: credentials.apiKey,
    api_secret: credentials.apiSecret,
    secure: true,
  });

  return cloudinary;
}

/**
 * Cloudinary folder names we accept: letters, digits, dash, underscore, dot and
 * slash. Anything else — quotes, spaces, colons, parentheses, wildcards — could
 * inject Search API syntax, so the value is rejected outright rather than
 * escaped, because every folder we own already matches this shape
 * (`bbn/eventos/2026-03-encontro-anual`).
 */
const SAFE_FOLDER = /^[A-Za-z0-9._\-/]+$/;

function sanitizeFolder(folder: string): string | null {
  const trimmed = folder.trim().replace(/^\/+|\/+$/g, "");
  if (!trimmed) return null;
  if (trimmed.includes("//") || trimmed.includes("..")) return null;
  if (!SAFE_FOLDER.test(trimmed)) return null;
  return trimmed;
}

type SearchResource = {
  public_id?: unknown;
  display_name?: unknown;
  width?: unknown;
  height?: unknown;
  format?: unknown;
  resource_type?: unknown;
  created_at?: unknown;
  image_metadata?: Record<string, unknown>;
};

/** EXIF dates look like "2026:03:21 19:02:11"; returns ISO or null. */
function exifToIso(metadata: SearchResource["image_metadata"]): string | null {
  if (!metadata) return null;
  for (const key of ["DateTimeOriginal", "CreateDate", "DateTimeDigitized"]) {
    const raw = metadata[key];
    if (typeof raw !== "string") continue;
    const m = raw.match(/^(\d{4})[:-](\d{2})[:-](\d{2})[ T](\d{2}):(\d{2}):(\d{2})/);
    if (m) return `${m[1]}-${m[2]}-${m[3]}T${m[4]}:${m[5]}:${m[6]}`;
  }
  return null;
}

/** Keeps only images and short clips, and drops anything missing an id. */
function toCloudMedia(resource: SearchResource): CloudMedia | null {
  const publicId = typeof resource.public_id === "string" ? resource.public_id : "";
  if (!publicId) return null;

  const resourceType = resource.resource_type;
  if (resourceType !== "image" && resourceType !== "video") return null;

  return {
    publicId,
    width: typeof resource.width === "number" ? resource.width : 0,
    height: typeof resource.height === "number" ? resource.height : 0,
    format: typeof resource.format === "string" ? resource.format : "",
    resourceType,
    createdAt: typeof resource.created_at === "string" ? resource.created_at : "",
    capturedAt: exifToIso(resource.image_metadata),
    displayName:
      typeof resource.display_name === "string" ? resource.display_name : publicId,
  };
}

const naturalOrder = new Intl.Collator("en", { numeric: true, sensitivity: "base" });

/**
 * Chronological order through an event:
 *  1. EXIF capture time, when the file still has it;
 *  2. then the camera's own file numbering (display name, compared naturally) —
 *     the reliable order when EXIF was stripped on export, as it was for the
 *     March 2026 photos;
 *  3. then upload time, as a last resort (a bulk upload makes it near-random).
 */
function byCaptureOrder(a: CloudMedia, b: CloudMedia): number {
  if (a.capturedAt && b.capturedAt && a.capturedAt !== b.capturedAt) {
    return a.capturedAt.localeCompare(b.capturedAt);
  }
  if (a.capturedAt && !b.capturedAt) return -1;
  if (!a.capturedAt && b.capturedAt) return 1;

  const byName = naturalOrder.compare(a.displayName, b.displayName);
  if (byName !== 0) return byName;

  return a.createdAt.localeCompare(b.createdAt);
}

/** One concise line — never a stack trace in the build log. */
function warn(context: string, error: unknown): void {
  const message = error instanceof Error ? error.message : String(error);
  console.warn(`[cloudinary] ${context} failed, falling back to no media: ${message}`);
}

async function runSearch(
  client: typeof cloudinary,
  expression: string,
): Promise<CloudMedia[]> {
  const result = await client.search
    .expression(expression)
    .with_field("image_metadata")
    .max_results(MAX_RESULTS)
    .execute();

  const resources: SearchResource[] = Array.isArray(result?.resources)
    ? result.resources
    : [];

  return resources
    .map(toCloudMedia)
    .filter((item): item is CloudMedia => item !== null);
}

/**
 * Every photo and clip in one event folder, in capture order.
 *
 * The account uses dynamic folders, where membership lives in `asset_folder`;
 * `folder:` is kept alongside so the query also works on fixed-folder accounts.
 */
export async function getEventMedia(folder: string): Promise<CloudMedia[]> {
  const client = getClient();
  if (!client) return [];

  const safeFolder = sanitizeFolder(folder);
  if (!safeFolder) {
    console.warn(`[cloudinary] ignoring unsafe folder name: ${folder}`);
    return [];
  }

  try {
    const media = await runSearch(
      client,
      `(asset_folder="${safeFolder}" OR folder:${safeFolder}/*)`,
    );
    return media.sort(byCaptureOrder);
  } catch (error) {
    warn(`search for "${safeFolder}"`, error);
    return [];
  }
}

/**
 * Most recent photos across all editions — feeds the home page's
 * "Acompanhe nossos eventos" grid. Images only: a muted looping clip would read
 * as broken in a static grid.
 */
export async function getLatestEventPhotos(limit: number): Promise<CloudMedia[]> {
  const client = getClient();
  if (!client) return [];

  const max = Math.min(Math.max(Math.trunc(limit) || 0, 1), MAX_RESULTS);

  try {
    const media = await runSearch(
      client,
      `(asset_folder:${EVENTS_ROOT}/* OR folder:${EVENTS_ROOT}/*) AND resource_type:image`,
    );
    // Newest first: reverse capture order, so the last frames of the latest
    // event lead.
    return media.sort(byCaptureOrder).reverse().slice(0, max);
  } catch (error) {
    warn("latest photos search", error);
    return [];
  }
}
