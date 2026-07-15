// Smoke test for the flip (openmobilehub/mcp-apps-shopping-demo#27): the demo is now
// a thin consumer of @openmobilehub/credentagent-*, so this asserts the CONTRACT the
// library gives us end-to-end — the shopping tools are served, the catalog flows, and
// checkout is credential-gated (payment required, no server-side bypass) — with the
// zero-config in-memory stores + static catalog (no Redis, no env).
import { describe, it, expect } from "vitest";
import request from "supertest";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { store } from "./main.js";

async function connect(): Promise<Client> {
  const server = store.mcpServer();
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  const client = new Client({ name: "flip-smoke", version: "1.0.0" });
  await Promise.all([server.connect(serverTransport), client.connect(clientTransport)]);
  return client;
}

describe("flip smoke — credential-gated storefront over the published library", () => {
  it("serves the shopping tools and this demo's catalog", async () => {
    const client = await connect();
    const tools = (await client.listTools()).tools.map((t) => t.name);
    expect(tools).toContain("browse-products");
    expect(tools).toContain("checkout");
    const browse = await client.callTool({ name: "browse-products", arguments: {} });
    expect(JSON.stringify(browse)).toContain("aurora-headphones"); // our catalog, not SAMPLE_CATALOG
  });

  it("checkout is gated — the payment requirement surfaces", async () => {
    const client = await connect();
    const sc = (
      await client.callTool({ name: "checkout", arguments: { items: [{ productId: "aurora-headphones", quantity: 1 }] } })
    ).structuredContent as { orderId?: string; requires?: Array<{ credential: string }> };
    expect(sc.orderId).toBeTruthy();
    expect(sc.requires?.some((e) => e.credential === "payment")).toBe(true);
  });

  it("BYPASS: a gated order POSTed straight to place-order is refused server-side (invariant 1)", async () => {
    const client = await connect();
    const orderId = (
      (await client.callTool({ name: "checkout", arguments: { items: [{ productId: "aurora-headphones", quantity: 1 }] } }))
        .structuredContent as { orderId: string }
    ).orderId;
    await request(store.app).post("/checkout/place-order").type("form").send({ order: orderId }).expect(403);
  });
});
