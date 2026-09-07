import { existsSync, readFileSync } from "fs";
import { resolve } from "path";

/**
 * Minimal .env loader, so secrets can live in a gitignored file locally
 * instead of being typed on the command line every time.
 *
 * This exists instead of the `dotenv` package because .npmrc sets
 * engine-strict=true against "node": "20.x", which blocks installing new
 * dependencies on newer Node versions.
 *
 * On Render this does nothing: there is no .env file there, and real
 * environment variables come from the dashboard. Variables already set in the
 * environment always win, so deployed config is never overridden by a stray file.
 */
export const loadEnv = (file = ".env"): void => {
  const path = resolve(process.cwd(), file);
  if (!existsSync(path)) return;

  for (const line of readFileSync(path, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const separator = trimmed.indexOf("=");
    if (separator === -1) continue;

    const key = trimmed.slice(0, separator).trim();
    const value = trimmed
      .slice(separator + 1)
      .trim()
      .replace(/^["']|["']$/g, "");

    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
};
