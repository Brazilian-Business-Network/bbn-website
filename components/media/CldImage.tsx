"use client";

/**
 * Client boundary for next-cloudinary's CldImage.
 *
 * next-cloudinary's bundle doesn't carry a "use client" directive, but CldImage
 * uses hooks, so rendering it straight from a server component fails at
 * prerender ("useState is not a function"). Server components import CldImage
 * from here instead. Only pass serializable props (no `loader` functions).
 * Pure helpers such as getCldImageUrl stay importable from "next-cloudinary".
 */
export { CldImage } from "next-cloudinary";
