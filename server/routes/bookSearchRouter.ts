import express, { Request, Response } from "express";
import axios from "axios";
import { IVolume } from "../models/Bookshelves";
import { createDebouncer } from "../debouncer";
import { searchUrl } from "../services/googleBooks";

import methodNotAllowedError from "../errors/methodNotAllowed";
import { title } from "process";

const router = express.Router();

const debounce = createDebouncer();

const noBookRoundResponse = (title: string) => {
  return {
    message: `No books matching '${title}' found.`,
    books: [],
  };
};

router
  .route("/:bookTitle")
  .get(async (req: Request, res: Response) => {
    const { bookTitle } = req.params;

    if (bookTitle.length < 2) {
      return res.send(noBookRoundResponse(bookTitle));
    }

    try {
      const response = await debounce(() => {
        return axios.get(searchUrl(bookTitle));
      });
      // @ts-ignore
      if (response.data.totalItems === 0) {
        return res.send(noBookRoundResponse(bookTitle));
      } else {
        // @ts-ignore
        const books = response.data.items.map(
          ({ id, volumeInfo }: IVolume): IVolume => {
            return { id, ...volumeInfo };
          }
        );
        return res.send({
          message: `Showing first ${books.length} results'`,
          books,
        });
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        return noBookRoundResponse(title);
      } else throw err;
    }
  })
  .all(methodNotAllowedError);

export default router;
