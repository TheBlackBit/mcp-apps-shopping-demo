// Vercel @vercel/node runtime: the express app the flip exports is the request
// handler. vercel.json rewrites every path here, so this one function serves /mcp,
// the checkout page, and the /credentagent/* ceremony rails. Importing main.js
// builds the storefront + mounts the gates (its listen() is skipped under VERCEL);
// cross-instance state comes from the Redis-backed stores when KV_REST_API_* is set.
import { app } from "../main.js";

export default app;
