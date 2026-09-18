export type KnowledgePassage = {
  id: string;
  title: string;
  section: string;
  url: string;
  text: string;
};

export type AssistantProduct = {
  sku: string;
  name: string;
  formattedPrice: string;
  availability: 'IN_STOCK' | 'OUT_OF_STOCK';
  url: string;
};

export type AssistantRequest = {
  question: string;
  variant: string;
};

const DEFAULT_VARIANT = 'SAR-90-200';
const MAX_QUESTION_LENGTH = 600;
const STOP_WORDS = new Set([
  'a', 'an', 'and', 'are', 'can', 'do', 'for', 'how', 'i', 'in', 'is', 'it', 'me', 'my',
  'of', 'on', 'or', 'the', 'to', 'what', 'when', 'where', 'which', 'with', 'you',
]);

export const KNOWLEDGE_BASE: KnowledgePassage[] = [
  {
    id: 'catalog-live-data',
    title: 'Live aircraft parts catalog',
    section: 'Products',
    url: 'https://aviation.ajayk.xyz/#products',
    text: 'The AEM experience reads public product identity, formatted price, availability, and aircraft-variant compatibility from a bounded gateway. Mage-OS remains the system of record. Snapshot catalog cards are dated, read-only, and cannot be used as evidence of current stock or price.',
  },
  {
    id: 'compatibility-boundary',
    title: 'Aircraft compatibility boundary',
    section: 'Products',
    url: 'https://aviation.ajayk.xyz/#products',
    text: 'Compatibility shown in this portfolio is fictional demonstration data. A user must confirm the aircraft variant and part eligibility through governed commerce data before starting an AOG purchase request. The assistant must never invent or certify aviation compatibility.',
  },
  {
    id: 'aog-workflow',
    title: 'Aircraft-on-ground response workflow',
    section: 'AOG Support',
    url: 'https://aviation.ajayk.xyz/#aog-support',
    text: 'The AOG demonstration verifies compatibility, applies company purchasing authority through manager approval, creates a native Mage-OS order, records fulfillment evidence, and shows a deterministic ERP export failure and retry. Human approval remains required before an order is created.',
  },
  {
    id: 'aog-handoff',
    title: 'Start an AOG request',
    section: 'AOG Support',
    url: 'https://store.ajayk.xyz/aircraft-on-ground-service',
    text: 'The transactional AOG request begins in the Mage-OS storefront. The assistant can help identify relevant demonstration parts and explain the process, but it cannot reserve inventory, approve a request, submit checkout, or create an order.',
  },
  {
    id: 'composable-ownership',
    title: 'Composable commerce ownership',
    section: 'Architecture',
    url: 'https://aviation.ajayk.xyz/#architecture',
    text: 'AEM Edge Delivery owns content and experience composition. The Cloudflare gateway provides bounded read-only composition. Mage-OS owns products, prices, availability, carts, customers, approvals, and orders. The curated snapshot is a visibly non-transactional outage experience.',
  },
  {
    id: 'demo-boundaries',
    title: 'Demonstration boundaries',
    section: 'About',
    url: 'https://aviation.ajayk.xyz/#about',
    text: 'Strawberry Aviation Supply, its products, compatibility data, fulfillment scenarios, and technical illustrations are fictional portfolio material. They are not valid for operational aviation, maintenance, airworthiness, or purchasing decisions.',
  },
];

function tokens(value: string): string[] {
  return [...new Set(value.toLowerCase().match(/[a-z0-9-]{2,}/g) || [])]
    .filter((token) => !STOP_WORDS.has(token));
}

function score(questionTokens: string[], value: string): number {
  const haystack = value.toLowerCase();
  return questionTokens.reduce((total, token) => total + (haystack.includes(token) ? 1 : 0), 0);
}

export function parseAssistantRequest(value: unknown): AssistantRequest {
  if (!value || typeof value !== 'object') throw new Error('Request body must be a JSON object');
  const record = value as Record<string, unknown>;
  const question = String(record.question || '').trim();
  const variant = String(record.variant || DEFAULT_VARIANT).trim();
  if (question.length < 3) throw new Error('Question must contain at least 3 characters');
  if (question.length > MAX_QUESTION_LENGTH) throw new Error(`Question must not exceed ${MAX_QUESTION_LENGTH} characters`);
  if (!/^[A-Z0-9-]{2,32}$/i.test(variant)) throw new Error('Aircraft variant is invalid');
  return { question, variant };
}

export function retrieveKnowledge(question: string, limit = 3): KnowledgePassage[] {
  const questionTokens = tokens(question);
  const ranked = KNOWLEDGE_BASE
    .map((passage) => ({ passage, score: score(questionTokens, `${passage.title} ${passage.section} ${passage.text}`) }))
    .filter((candidate) => candidate.score > 0)
    .sort((left, right) => right.score - left.score || left.passage.id.localeCompare(right.passage.id))
    .slice(0, limit)
    .map((candidate) => candidate.passage);
  return ranked.length ? ranked : [KNOWLEDGE_BASE[0], KNOWLEDGE_BASE[4]];
}

export function selectProducts(question: string, products: AssistantProduct[], limit = 3): AssistantProduct[] {
  const questionTokens = tokens(question);
  return products
    .map((product) => ({ product, score: score(questionTokens, `${product.sku} ${product.name}`) }))
    .filter((candidate) => candidate.score > 0)
    .sort((left, right) => right.score - left.score || left.product.sku.localeCompare(right.product.sku))
    .slice(0, limit)
    .map((candidate) => candidate.product);
}

export function buildGroundedPrompt(
  question: string,
  passages: KnowledgePassage[],
  products: AssistantProduct[],
  commerceSource: string,
): Array<{ role: 'system' | 'user'; content: string }> {
  const sources = passages.map((passage, index) => (
    `[${index + 1}] ${passage.title} — ${passage.text}`
  )).join('\n');
  const productFacts = products.length
    ? products.map((product) => `${product.sku}: ${product.name}; ${product.formattedPrice || 'price unavailable'}; ${product.availability}`).join('\n')
    : 'No product matched the question.';
  return [
    {
      role: 'system',
      content: 'You are Strawberry Scout, a concise read-only assistant for a fictional aviation commerce demonstration. Answer only from the supplied sources and live commerce facts. Cite factual guidance with [1], [2], or [3]. Never claim certified compatibility, reserve stock, approve purchasing, create carts or orders, or provide maintenance instructions. If evidence is insufficient, say so and direct the user to the AOG workflow or product details.',
    },
    {
      role: 'user',
      content: `Question: ${question}\n\nApproved sources:\n${sources}\n\nCommerce source: ${commerceSource}\nLive product facts:\n${productFacts}`,
    },
  ];
}

export function deterministicAnswer(products: AssistantProduct[]): string {
  if (products.length) {
    const names = products.map((product) => `${product.name} (${product.sku})`).join(', ');
    return `I found ${names} in the read-only catalog. Review the linked product details and confirm fictional aircraft compatibility before starting an AOG request. [1]`;
  }
  return 'I can explain the fictional catalog, compatibility boundary, AOG approval flow, and composable architecture. I do not have enough grounded evidence for a more specific answer; use the cited guidance or continue to the governed AOG request. [1]';
}

export function generatedText(value: unknown): string | null {
  if (!value || typeof value !== 'object') return null;
  const response = String((value as Record<string, unknown>).response || '').trim();
  return response || null;
}
