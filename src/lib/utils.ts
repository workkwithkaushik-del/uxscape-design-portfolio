import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseSpotifyUrl(input: string): { type: string; id: string } | null {
  const cleanInput = input.trim();

  const uriMatch = cleanInput.match(/^spotify:(track|playlist|album):([a-zA-Z0-9]+)$/i);
  if (uriMatch) {
    return { type: uriMatch[1].toLowerCase(), id: uriMatch[2] };
  }

  try {
    const url = new URL(cleanInput);
    if (url.hostname === "open.spotify.com") {
      const parts = url.pathname.split("/").filter(Boolean);
      if (parts.length >= 2 && ["track", "playlist", "album"].includes(parts[0].toLowerCase())) {
        return { type: parts[0].toLowerCase(), id: parts[1] };
      }
    }
  } catch (e) {
    // URL parsing failed, fallback to regex search
  }

  const regex = /(track|playlist|album)[/:][a-zA-Z0-9]+/i;
  const match = cleanInput.match(regex);
  if (match) {
    const parts = match[0].replace(":", "/").split("/");
    return { type: parts[0].toLowerCase(), id: parts[1] };
  }

  return null;
}
