/**
 * The server is for the Book Store project
 * @author AlbanyCanCode
 */
import app from "./app";
import Bookshelves from "./models/Bookshelves";

const PORT = process.env.PORT || 3000;

/**
 * A rejected promise anywhere would otherwise take the whole process down,
 * which on a host like Render reads as "the app won't start."
 */
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled promise rejection (server still running):", reason);
});

app.listen(PORT, () => {
  console.log(`\nYour server is running on http://localhost:${PORT}/`);
  console.log(`\nPress ctrl+c to stop\n`);
});

/**
 * Seeding happens *after* listen and never rejects into the process. Loading
 * the demo books is a nice-to-have; being reachable is not. If Google returns
 * a 429 here, the bookshelf route retries on demand.
 */
Bookshelves.ensureSeeded().catch((err: unknown) => {
  console.warn(
    "[startup] Could not load starter bookshelves:",
    err instanceof Error ? err.message : err
  );
  console.warn("[startup] The server is up; shelves will retry on request.");
});
