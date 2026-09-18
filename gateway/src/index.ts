import { createSchema, createYoga } from 'graphql-yoga';
import {
  buildGroundedPrompt,
  deterministicAnswer,
  generatedText,
  parseAssistantRequest,
  retrieveKnowledge,
  selectProducts,
} from './assistant';

export type CatalogProduct = {
  sku: string;
  name: string;
  formattedPrice: string;
  availability: 'IN_STOCK' | 'OUT_OF_STOCK';
  url: string;
};

const ASSISTANT_MODEL = '@cf/meta/llama-3.3-70b-instruct-fp8-fast';

type CatalogResult = {
  items: CatalogProduct[];
  totalCount: number;
  source: 'LIVE_MAGE_OS' | 'CURATED_SNAPSHOT';
  dataTimestamp: string;
};

type ServerContext = {
  env: Env;
  executionCtx: ExecutionContext;
};

const SNAPSHOT_DATE = '2026-09-10T00:00:00.000Z';
const SNAPSHOT: CatalogProduct[] = [
  {
    sku: 'SAS-HYD-1001',
    name: 'Hydraulic Pump Assembly',
    formattedPrice: '$12,450.00',
    availability: 'IN_STOCK',
    url: 'https://store.ajayk.xyz/catalogsearch/result/?q=SAS-HYD-1001',
  },
  {
    sku: 'SAS-BRK-2001',
    name: 'Carbon Brake Assembly',
    formattedPrice: '$8,760.00',
    availability: 'IN_STOCK',
    url: 'https://store.ajayk.xyz/catalogsearch/result/?q=SAS-BRK-2001',
  },
  {
    sku: 'SAS-AVN-3001',
    name: 'Flight Control Data Unit',
    formattedPrice: '$24,900.00',
    availability: 'OUT_OF_STOCK',
    url: 'https://store.ajayk.xyz/catalogsearch/result/?q=SAS-AVN-3001',
  },
];

function allowedOrigins(env: Env): Set<string> {
  return new Set(env.ALLOWED_ORIGINS.split(',').map((origin) => origin.trim()).filter(Boolean));
}

function normalizedProduct(value: unknown, commerceOrigin: string): CatalogProduct | null {
  if (!value || typeof value !== 'object') return null;
  const record = value as Record<string, unknown>;
  const sku = String(record.sku || '').trim();
  const name = String(record.name || '').trim();
  if (!sku || !name) return null;
  let url = `${commerceOrigin}/catalogsearch/result/?q=${encodeURIComponent(sku)}`;
  try {
    const candidate = new URL(String(record.url || ''), commerceOrigin);
    if (candidate.origin === commerceOrigin) url = candidate.href;
  } catch { /* use bounded search URL */ }
  return {
    sku,
    name,
    formattedPrice: String(record.formatted_price || '').trim(),
    availability: record.availability === 'in_stock' ? 'IN_STOCK' : 'OUT_OF_STOCK',
    url,
  };
}

async function liveCatalog(env: Env, variant: string): Promise<CatalogProduct[]> {
  const origin = new URL(env.MAGE_OS_ORIGIN).origin;
  const endpoint = `${origin}/rest/V1/strawberry/catalog/variant/${encodeURIComponent(variant)}`;
  const response = await fetch(endpoint, {
    headers: { accept: 'application/json' },
    signal: AbortSignal.timeout(4000),
    cf: { cacheEverything: true, cacheTtl: 60 },
  });
  if (!response.ok) throw new Error(`Mage-OS returned ${response.status}`);
  const payload: unknown = await response.json();
  if (!Array.isArray(payload)) throw new Error('Mage-OS returned an invalid catalog response');
  return payload.map((item) => normalizedProduct(item, origin)).filter((item): item is CatalogProduct => item !== null);
}

function filtered(items: CatalogProduct[], search: string | undefined, first: number): CatalogProduct[] {
  const term = search?.trim().toLowerCase();
  const matches = term
    ? items.filter((item) => `${item.sku} ${item.name}`.toLowerCase().includes(term))
    : items;
  return matches.slice(0, Math.min(Math.max(first, 1), 24));
}

async function catalog(env: Env, variant: string, search: string | undefined, first: number): Promise<CatalogResult> {
  try {
    const items = await liveCatalog(env, variant);
    const visible = filtered(items, search, first);
    return { items: visible, totalCount: items.length, source: 'LIVE_MAGE_OS', dataTimestamp: new Date().toISOString() };
  } catch (error) {
    console.error(JSON.stringify({ event: 'catalog_fallback', variant, error: error instanceof Error ? error.message : 'unknown' }));
    const visible = filtered(SNAPSHOT, search, first);
    return { items: visible, totalCount: SNAPSHOT.length, source: 'CURATED_SNAPSHOT', dataTimestamp: SNAPSHOT_DATE };
  }
}

const yoga = createYoga<ServerContext>({
  graphqlEndpoint: '/graphql',
  graphiql: false,
  batching: false,
  maskedErrors: true,
  schema: createSchema({
    typeDefs: /* GraphQL */ `
      enum Availability { IN_STOCK OUT_OF_STOCK }
      enum DataSource { LIVE_MAGE_OS CURATED_SNAPSHOT }
      type Product { sku: ID!, name: String!, formattedPrice: String!, availability: Availability!, url: String! }
      type ProductConnection { items: [Product!]!, totalCount: Int!, source: DataSource!, dataTimestamp: String! }
      type ServiceStatus { status: String!, commerceOrigin: String! }
      type Query {
        products(variant: String!, search: String, first: Int = 12): ProductConnection!
        product(variant: String!, sku: ID!): Product
        serviceStatus: ServiceStatus!
      }
    `,
    resolvers: {
      Query: {
        products: (_root, args: { variant: string; search?: string; first: number }, context: ServerContext) => (
          catalog(context.env, args.variant, args.search, args.first)
        ),
        product: async (_root, args: { variant: string; sku: string }, context: ServerContext) => {
          const result = await catalog(context.env, args.variant, args.sku, 24);
          return result.items.find((item) => item.sku === args.sku) || null;
        },
        serviceStatus: (_root, _args, context: ServerContext) => ({
          status: 'operational',
          commerceOrigin: new URL(context.env.MAGE_OS_ORIGIN).origin,
        }),
      },
    },
  }),
});

function corsHeaders(request: Request, env: Env): HeadersInit {
  const origin = request.headers.get('origin');
  if (!origin || !allowedOrigins(env).has(origin)) return {};
  return {
    'access-control-allow-origin': origin,
    'access-control-allow-methods': 'GET, POST, OPTIONS',
    'access-control-allow-headers': 'content-type',
    vary: 'Origin',
  };
}

function responseHeaders(request: Request, env: Env): Headers {
  const headers = new Headers(corsHeaders(request, env));
  headers.set('cache-control', 'no-store');
  headers.set('content-security-policy', "default-src 'none'; frame-ancestors 'none'");
  headers.set('x-content-type-options', 'nosniff');
  return headers;
}

async function assistant(request: Request, env: Env): Promise<Response> {
  if (request.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405, headers: responseHeaders(request, env) });
  }
  const length = Number(request.headers.get('content-length') || 0);
  if (length > 4096) {
    return Response.json({ error: 'Request body is too large' }, { status: 413, headers: responseHeaders(request, env) });
  }
  try {
    const input = parseAssistantRequest(await request.json());
    const passages = retrieveKnowledge(input.question);
    const catalogResult = await catalog(env, input.variant, undefined, 12);
    const products = selectProducts(input.question, catalogResult.items);
    let answer = deterministicAnswer(products);
    let generatedBy = 'deterministic-fallback';
    try {
      const result: unknown = await env.AI.run(ASSISTANT_MODEL, {
        messages: buildGroundedPrompt(input.question, passages, products, catalogResult.source),
        max_tokens: 320,
        temperature: 0.1,
      });
      answer = generatedText(result) || answer;
      generatedBy = generatedText(result) ? 'workers-ai' : generatedBy;
    } catch (error) {
      console.error(JSON.stringify({
        event: 'assistant_generation_fallback',
        requestId: request.headers.get('cf-ray') || 'local',
        error: error instanceof Error ? error.message : 'unknown',
      }));
    }
    return Response.json({
      answer,
      citations: passages.map(({ id, title, section, url }) => ({ id, title, section, url })),
      products,
      commerceSource: catalogResult.source,
      generatedBy,
      requestId: request.headers.get('cf-ray') || crypto.randomUUID(),
      boundaries: ['read-only', 'fictional-demo', 'human-approval-required'],
    }, { headers: responseHeaders(request, env) });
  } catch (error) {
    return Response.json({
      error: error instanceof Error ? error.message : 'Invalid request',
    }, { status: 400, headers: responseHeaders(request, env) });
  }
}

export default {
  async fetch(request, env, ctx): Promise<Response> {
    const url = new URL(request.url);
    if (request.method === 'OPTIONS') {
      const origin = request.headers.get('origin');
      if (!origin || !allowedOrigins(env).has(origin)) return new Response(null, { status: 403 });
      return new Response(null, { status: 204, headers: corsHeaders(request, env) });
    }
    if (url.pathname === '/health') return Response.json({ status: 'ok' }, { headers: { 'cache-control': 'no-store' } });
    if (url.pathname === '/assistant') return assistant(request, env);
    if (url.pathname !== '/graphql') return Response.json({ error: 'Not found' }, { status: 404 });
    const response = await yoga.fetch(request, { env, executionCtx: ctx });
    const headers = new Headers(response.headers);
    Object.entries(corsHeaders(request, env)).forEach(([name, value]) => headers.set(name, value));
    headers.set('cache-control', 'public, max-age=30, s-maxage=60');
    headers.set('x-content-type-options', 'nosniff');
    return new Response(response.body, { status: response.status, headers });
  },
} satisfies ExportedHandler<Env>;
