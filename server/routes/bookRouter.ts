import express, { Request, Response } from "express";
import axios from "axios";
import Bookshelves from "../models/Bookshelves";
import { getUserId } from "../middlewares/auth";
import { stripHtml } from "string-strip-html";
import { volumeUrl } from "../services/googleBooks";

import methodNotAllowedError from "../errors/methodNotAllowed";

const router = express.Router();

router
  .route("/:bookId")
  .get(getUserId, (req: Request, res: Response) => {
    const { bookId } = req.params;
    const { userId } = req.body;

    axios
      .get(volumeUrl(bookId))
      .then((response) => {
        // @ts-ignore
        const shelf = Bookshelves.findShelfForBook(userId, bookId);
        // stripHtml throws on undefined, and plenty of volumes have no description.
        const rawDescription = response.data.volumeInfo?.description;
        const description = rawDescription ? stripHtml(rawDescription).result : "";
        const book = {
          id: bookId,
          ...response.data.volumeInfo,
          ...{ description },
          ...(shelf && { shelf }),
        };
        return res.send({ book });
      })
      .catch((err) => {
        // TODO log error when not found
        return res
          .status(404)
          .send({ message: `No book with book ID ${bookId} found.` });
      });
  })
  .all(methodNotAllowedError);

export default router;
