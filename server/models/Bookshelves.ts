import { stripHtml } from "string-strip-html";

/**
 * Usually, we would store our data in a database instead of a plain text file
 * that we are committing to git. However, for the purposes of demonstrating
 * the front-end of student portfolio piece, this works fine.
 */
import {
  setStartBookshelves,
  getStartBookshelves,
} from "../assets/starterBookshelves";

let shelves = [] as IBook[];
let seeded = false;
let seedingInFlight: Promise<void> | null = null;

type ShelfTypes = "wantToRead" | "currentlyReading" | "read";

export interface IVolume {
  title: string;
  description?: string;
  [key: string]: any;
}

export interface IBook extends IVolume {
  id: string;
  userId: string;
  shelf?: ShelfTypes;
}

export interface IBookshelfBook extends IVolume {
  shelf?: ShelfTypes;
}

export interface IBookshelf {
  wantToRead: IBookshelfBook[];
  currentlyReading: IBookshelfBook[];
  read: IBookshelfBook[];
}

class Bookshelves {
  static getBookshelf(userId: string): IBookshelf {
    const skeleton: IBookshelf = {
      wantToRead: [],
      currentlyReading: [],
      read: [],
    };
    return shelves.reduce((bookshelf, book) => {
      const { userId: bookUserId, ...restOfBook } = book;
      if (book.shelf && bookUserId === userId) {
        bookshelf[book.shelf].push(restOfBook);
      }
      return bookshelf;
    }, skeleton);
  }
  static getBook(userId: string, bookId: string): IBookshelfBook {
    const book = shelves.find(
      (book) => book.id === bookId && book.userId === userId
    );
    if (!book) throw new Error(`Book "${bookId}" not found`);

    if (book.userId) {
      const { userId, ...restOfBook } = book;
      return restOfBook;
    }
    return book;
  }
  static hasBook(userId: string, bookId: string): boolean {
    try {
      return !!Bookshelves.getBook(userId, bookId);
    } catch (err) {
      return false;
    }
  }
  static findShelfForBook(
    userId: string,
    bookId: string
  ): ShelfTypes | undefined {
    try {
      const book = Bookshelves.getBook(userId, bookId);
      return book.shelf;
    } catch (err) {
      return undefined;
    }
  }
  static insertBook(
    userId: string,
    bookId: string,
    volumeInfo: IVolume,
    shelf: ShelfTypes
  ): void {
    const description = volumeInfo.description
      ? stripHtml(volumeInfo.description).result
      : null;
    const book: IBook = {
      id: bookId,
      ...volumeInfo,
      ...(description && { description }),
      userId,
      shelf,
    };
    shelves = structuredClone(shelves);
    shelves.push(book);
  }
  static deleteBook(userId: string, bookId: string): void {
    shelves = structuredClone(
      shelves.filter((book) => !(book.id === bookId && book.userId === userId))
    );
  }
  static updateBookshelf(
    userId: string,
    bookId: string,
    volumeInfo: IVolume,
    shelf: ShelfTypes
  ): void {
    Bookshelves.deleteBook(userId, bookId);
    Bookshelves.insertBook(userId, bookId, volumeInfo, shelf);
  }
  static async initialBookshelf(): Promise<void> {
    const { loaded } = await setStartBookshelves();
    if (loaded === 0) return;

    // Don't clobber books a signed-in user already added while unseeded.
    if (shelves.length === 0) {
      shelves = getStartBookshelves();
    }
    seeded = true;
  }

  /**
   * Seeds the shelves if that hasn't succeeded yet, and is safe to call on
   * every request. Google rate-limits by IP, so the boot-time attempt can come
   * back empty; retrying here lets the shelves fill in once the limit clears,
   * with no restart or redeploy. Concurrent callers share one in-flight
   * request rather than each firing their own.
   */
  static async ensureSeeded(): Promise<void> {
    if (seeded) return;

    if (!seedingInFlight) {
      seedingInFlight = Bookshelves.initialBookshelf().finally(() => {
        seedingInFlight = null;
      });
    }
    await seedingInFlight;
  }
  static refreshBookshelf(): void {
    shelves = getStartBookshelves();
  }
}

export default Bookshelves;
