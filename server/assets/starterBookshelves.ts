import { IBook } from "../models/Bookshelves";
import axios from "axios";
import { volumeUrl } from "../services/googleBooks";

/**
 * Usually, we would store our users in a database instead of a plain text file
 * that we are committing to git. However, for the purposes of demonstrating
 * the front-end of student portfolio piece, this works fine.
 */
const STARTER_BOOKS = [
  { id: "qKydDAAAQBAJ", userId: "2725", shelf: "wantToRead" },
  { id: "A1QoDwAAQBAJ", userId: "2725", shelf: "wantToRead" },
  { id: "aHo3DwAAQBAJ", userId: "2725", shelf: "wantToRead" },
  { id: "ppjUtAEACAAJ", userId: "2725", shelf: "currentlyReading" },
  { id: "dgYvDwAAQBAJ", userId: "2725", shelf: "read" },
  { id: "YhdU8thA6eEC", userId: "2725", shelf: "read" },
  { id: "F9wIMQAACAAJ", userId: "2725", shelf: "read" },
  { id: "oy3psgEACAAJ", userId: "5976", shelf: "currentlyReading" },
] as const;

let starterBookshelves: IBook[] = [];

export interface StarterLoadResult {
  loaded: number;
  total: number;
}

/**
 * Fetches the demo books from Google Books.
 *
 * Uses allSettled rather than all: Google rate-limits by IP, and a single 429
 * should not discard the books that did come back. Whatever loads is kept, and
 * the caller can retry later for the rest.
 */
export const setStartBookshelves = async (): Promise<StarterLoadResult> => {
  const results = await Promise.allSettled(
    STARTER_BOOKS.map(({ id, userId, shelf }) =>
      axios
        .get(volumeUrl(id))
        .then(({ data }): IBook => ({ id, userId, shelf, ...data.volumeInfo }))
    )
  );

  starterBookshelves = results.flatMap((result) =>
    result.status === "fulfilled" ? [result.value] : []
  );

  const failed = results.length - starterBookshelves.length;
  if (failed > 0) {
    console.warn(
      `[starter books] Loaded ${starterBookshelves.length} of ${results.length} from Google Books. ` +
        `${failed} failed (usually a 429 rate limit). Set GOOGLE_BOOKS_API_KEY to raise the quota.`
    );
  }

  return { loaded: starterBookshelves.length, total: results.length };
};

export const getStartBookshelves = () => structuredClone(starterBookshelves);

export default starterBookshelves;
