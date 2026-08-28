// Product Picker — a credential-gated agentic storefront, now a thin consumer of
// @openmobilehub/credentagent-*. The cart/order/verification stores, checkout page,
// pricing, and the passkey / dc-payment / credential ceremony rails it used to
// hand-roll all live in the library; this file just supplies the catalog and the
// gate policy. See openmobilehub/mcp-apps-shopping-demo#27.
import { fileURLToPath } from "node:url";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createStorefront } from "@openmobilehub/credentagent-storefront/server";
import { redisStorage } from "@openmobilehub/credentagent-storefront/redis";
import { CredentAgent, age, membership, payment, required, optional } from "@openmobilehub/credentagent-gate";
import { CATALOG, REVIEWS } from "./catalog.js";

// Serverless (Vercel): instances share no memory, so an ephemeral per-instance key
// can't survive an options→verify hop — a stable GATE_SECRET is required.
const deployed = !!process.env.VERCEL;
if (deployed && !process.env.GATE_SECRET) {
  throw new Error("GATE_SECRET is required on a deployment — generate one with: openssl rand -hex 32");
}

// Shared cross-instance state via Vercel KV / Upstash Redis when configured; the
// library owns the adapters (redisStorage), so we pass config, not code. Absent ⇒
// the zero-config in-memory default (local dev / CI / DEMO_MODE).
const kv = {
  url: process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN,
};
const publicBaseUrl =
  process.env.PUBLIC_BASE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : undefined);

export const store = createStorefront({
  catalog: CATALOG,
  reviews: REVIEWS,
  signingKey: process.env.GATE_SECRET,
  statelessOrders: deployed, // the signed cart mandate carries the order between instances
  statelessMcp: deployed, // no per-instance MCP session — survives Vercel's instance split
  storage: kv.url && kv.token ? redisStorage({ url: kv.url, token: kv.token }) : undefined,
  ...(publicBaseUrl ? { baseUrl: publicBaseUrl } : {}),
});

// The demo reader identity (openmobilehub/credentagent#51). Supplied, the gate signs each
// OpenID4VP request as a reader named on the demo RICAL, so a wallet that imported that list
// shows this verifier as trusted instead of "The website requesting this data is unknown".
// Absent, the gate self-signs an ephemeral cert per request — the ceremony still completes,
// the wallet just shows the verifier as unknown. The cert's SubjectAltName must include this
// deployment's host, or the wallet rejects the request outright (origin binding).
// Only the READER key belongs here: a popped gate can impersonate the demo reader, nothing more.
const readerIdentity =
  process.env.CREDENTAGENT_READER_KEY && process.env.CREDENTAGENT_READER_CERT
    ? { key: process.env.CREDENTAGENT_READER_KEY, cert: process.env.CREDENTAGENT_READER_CERT }
    : undefined;

const credentagent = new CredentAgent({
  ...(publicBaseUrl ? { walletOrigin: publicBaseUrl } : {}),
  ...(readerIdentity ? { readerIdentity } : {}),
});
credentagent.mount(store.app); // wires the /credentagent/* ceremony rails onto this server

// The gate policy: age only when the cart holds an age-restricted item, an optional
// loyalty discount, and payment (amount derived server-side from the order, settles last).
store.gate((order) =>
  credentagent.requirements(order, [
    required(age.over(21).when((o) => o.lines.some((l) => l.minimumAge != null))),
    optional(membership.discount(10)),
    required(payment.in("usd")),
  ]),
);

// The exported express app is what Vercel's @vercel/node runtime serves (api/index.ts).
export const app = store.app;

async function main(): Promise<void> {
  if (process.argv.includes("--stdio")) {
    // stdio mode has no HTTP server of its own, but openLink needs a reachable
    // checkout URL — serve the SAME express app (checkout page + gates) in-process
    // so every link the widget opens shares this server's cart / order state.
    const port = Number(process.env.CHECKOUT_PORT ?? 3030);
    store.app.listen(port, () => console.error(`Checkout + gates on http://localhost:${port}`));
    await store.mcpServer().connect(new StdioServerTransport());
  } else {
    const port = Number(process.env.PORT ?? 3001);
    const { url } = await store.listen(port);
    console.error(`MCP server on ${url}`);
  }
}

// Run main() only when executed directly (`node dist/main.js`). When imported —
// by api/index.ts on Vercel, or by the smoke test — the module just exports `app`
// / `store` and never starts listening.
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
