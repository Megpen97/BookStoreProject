import { generateRandomString } from "./util";
import { loadEnv } from "./loadEnv";

// Must run before anything below reads process.env.
loadEnv();

/**
 * Typically, the JWT secret would be within a vault or encrypted in environmental variables.
 * Also, it should not be generated every time the application starts up.
 * However, to make it easy for anyone to start this portfolio piece,
 * and to avoid being flagged as not secure by GitHub,
 * I generating the JWT token so that it is not hardcoded.
 */
const jwtSecret = generateRandomString();

export const JWT_SECRET = jwtSecret;
export const JWT_EXPIRY_IN_MILLISECONDS = 86400000; // 24 hours (normally, this would be 15 minutes for applications with sensitive data)

/**
 * Optional. Without it, Google Books requests are unauthenticated and share a
 * low per-IP quota, which is what causes intermittent 429 responses.
 * Set this in the Render dashboard (Environment > Add Environment Variable).
 */
export const GOOGLE_BOOKS_API_KEY = process.env.GOOGLE_BOOKS_API_KEY || "";
