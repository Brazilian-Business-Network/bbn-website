import { Lato, Playfair_Display, Poppins } from "next/font/google";

/**
 * The institutional PDF sets headings in Kief Montaser, which is licensed and
 * not redistributable. Per CLAUDE.md we fall back to Playfair Display.
 *
 * To swap in the real face later, drop the files into public/fonts/ and replace
 * this export with a `next/font/local` call keeping the same CSS variable name
 * (`--font-playfair`) — nothing else in the codebase needs to change.
 */
export const fontSerif = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

/** Uppercase letter-spaced labels. */
export const fontLabel = Poppins({
  variable: "--font-poppins",
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600"],
  display: "swap",
});

/** Body copy. */
export const fontBody = Lato({
  variable: "--font-lato",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "700"],
  display: "swap",
});

export const fontVariables = [
  fontSerif.variable,
  fontLabel.variable,
  fontBody.variable,
].join(" ");
