import { GOOGLE_BOOKS_API_KEY } from "../config";

const BASE_URL = "https://www.googleapis.com/books/v1/volumes";

/**
 * Google Books allows unauthenticated requests, but the per-IP quota is low
 * enough that a shared host (like Render's free tier) hits 429s regularly.
 * Setting GOOGLE_BOOKS_API_KEY raises that quota. The key stays on the server
 * so it is never exposed to the browser.
 */
const withKey = (url: string): string => {
  if (!GOOGLE_BOOKS_API_KEY) return url;
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}key=${GOOGLE_BOOKS_API_KEY}`;
};

export const volumeUrl = (bookId: string): string =>
  withKey(`${BASE_URL}/${encodeURIComponent(bookId)}`);

export const searchUrl = (title: string): string =>
  withKey(
    `${BASE_URL}?q=${encodeURIComponent(
      title
    )}&maxAllowedMaturityRating=not-mature&maxResults=20&orderBy=relevance&printType=books&fields=items(id%2CvolumeInfo)%2CtotalItems`
  );
