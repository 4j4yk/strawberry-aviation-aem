const DEFAULT_ORIGIN = 'https://store.ajayk.xyz';
const DEFAULT_GATEWAY = 'https://strawberry-catalog-gateway.ajaykhampariya14.workers.dev/graphql';
const DEFAULT_VARIANT = 'SAR-90-200';
const REQUEST_TIMEOUT = 4500;

function cellText(cell) {
  return cell?.textContent.trim() || '';
}

function safeOrigin(value, fallback = DEFAULT_ORIGIN) {
  try {
    const url = new URL(value || fallback);
    if (url.protocol !== 'https:' && !['localhost', '127.0.0.1'].includes(url.hostname)) throw new Error();
    return url.origin;
  } catch {
    return fallback;
  }
}

function parse(block) {
  const config = {
    gateway: DEFAULT_GATEWAY,
    origin: DEFAULT_ORIGIN,
    storefront: DEFAULT_ORIGIN,
    variant: DEFAULT_VARIANT,
  };
  const fallback = [];
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const key = cellText(cells[0]).toLowerCase();
    if (key === 'catalog gateway') {
      config.gateway = `${safeOrigin(cellText(cells[1]), new URL(DEFAULT_GATEWAY).origin)}/graphql`;
    }
    if (key === 'commerce origin') config.origin = safeOrigin(cellText(cells[1]));
    if (key === 'storefront') config.storefront = safeOrigin(cellText(cells[1]));
    if (key === 'aircraft variant') config.variant = cellText(cells[1]) || DEFAULT_VARIANT;
    if (key === 'product') {
      fallback.push({
        name: cellText(cells[1]),
        sku: cellText(cells[2]),
        price: cellText(cells[3]),
        availability: cellText(cells[4]),
        url: cells[5]?.querySelector('a')?.href || cellText(cells[5]),
        snapshot: cellText(cells[6]),
      });
    }
  });
  return { config, fallback };
}

function safeProductUrl(value, storefront, sku) {
  const base = new URL(storefront);
  try {
    const candidate = new URL(String(value || ''), base);
    if (candidate.origin === base.origin) return candidate.href;
  } catch { /* use bounded search URL */ }
  return `${base.origin}/catalogsearch/result/?q=${encodeURIComponent(sku)}`;
}

function normalize(item, storefront, source = 'snapshot') {
  if (!item || typeof item !== 'object') return null;
  const sku = String(item.sku || '').trim();
  const name = String(item.name || '').trim();
  if (!sku || !name) return null;
  return {
    sku,
    name,
    price: String(item.formatted_price || item.price || '').trim(),
    availability: String(item.availability || '').trim(),
    url: safeProductUrl(item.url, storefront, sku),
    source,
    snapshot: String(item.snapshot || '').trim(),
  };
}

function createCard(product) {
  const item = document.createElement('li');
  item.className = 'aviation-catalog-card';
  const meta = document.createElement('p');
  meta.className = 'aviation-catalog-sku';
  meta.textContent = product.sku;
  const heading = document.createElement('h3');
  const link = document.createElement('a');
  link.href = product.url;
  link.textContent = product.name;
  heading.append(link);
  const details = document.createElement('p');
  details.className = 'aviation-catalog-details';
  details.textContent = [product.price, product.availability].filter(Boolean).join(' · ')
    || 'See current details in Mage-OS';
  const action = document.createElement('a');
  action.className = 'aviation-catalog-action';
  action.href = product.url;
  action.textContent = product.source === 'live' ? 'View live product' : 'Open reference store';
  item.append(meta, heading, details, action);
  return item;
}

function disableActions(cards) {
  cards.querySelectorAll('a').forEach((link) => {
    link.setAttribute('aria-disabled', 'true');
    link.removeAttribute('href');
  });
}

async function fetchCatalog(config) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
  try {
    const response = await fetch(config.gateway, {
      method: 'POST',
      credentials: 'omit',
      headers: { accept: 'application/json', 'content-type': 'application/json' },
      body: JSON.stringify({
        query: 'query AviationCatalog($variant: String!, $first: Int!) { products(variant: $variant, first: $first) { items { sku name formattedPrice availability url } source dataTimestamp totalCount } }',
        variables: { variant: config.variant, first: 24 },
      }),
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`Commerce API returned ${response.status}`);
    const payload = await response.json();
    const result = payload?.data?.products;
    if (!Array.isArray(result?.items)) throw new Error('Catalog gateway returned an invalid response');
    return {
      products: result.items.map((item) => normalize({
        ...item,
        formatted_price: item.formattedPrice,
        availability: item.availability === 'IN_STOCK' ? 'in_stock' : 'out_of_stock',
      }, config.storefront, result.source === 'LIVE_MAGE_OS' ? 'live' : 'snapshot')).filter(Boolean),
      source: result.source,
      timestamp: result.dataTimestamp,
    };
  } finally {
    window.clearTimeout(timeout);
  }
}

function announce(block, state, message) {
  block.dataset.commerceState = state;
  block.querySelector('.aviation-catalog-status').textContent = message;
  document.dispatchEvent(new CustomEvent('strawberry:catalog-state', {
    detail: { state, message },
  }));
}

export default async function decorate(block) {
  const { config, fallback } = parse(block);
  const fallbackProducts = fallback
    .map((item) => normalize(item, config.storefront))
    .filter(Boolean);
  const intro = document.createElement('div');
  intro.className = 'aviation-catalog-intro';
  const kicker = document.createElement('p');
  kicker.className = 'aviation-catalog-kicker';
  kicker.textContent = 'Aircraft-ready inventory';
  const heading = document.createElement('h2');
  heading.textContent = `Parts for ${config.variant}`;
  intro.append(kicker, heading);
  const status = document.createElement('p');
  status.className = 'aviation-catalog-status';
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');
  status.textContent = 'Checking live Mage-OS availability…';
  const cards = document.createElement('ul');
  cards.className = 'aviation-catalog-grid';
  fallbackProducts.forEach((product) => cards.append(createCard(product)));
  block.replaceChildren(intro, status, cards);
  block.dataset.variant = config.variant;

  async function refresh() {
    announce(block, 'loading', `Checking live Mage-OS parts for ${config.variant}…`);
    try {
      const result = await fetchCatalog(config);
      const { products } = result;
      if (!products.length) throw new Error('No products were returned');
      cards.replaceChildren(...products.map(createCard));
      if (result.source === 'LIVE_MAGE_OS') {
        announce(block, 'live', `${products.length} live ${products.length === 1 ? 'part' : 'parts'} from Mage-OS.`);
      } else {
        const date = new Date(result.timestamp).toLocaleDateString();
        disableActions(cards);
        announce(block, 'snapshot', `Mage-OS is unavailable. Showing a read-only catalog snapshot dated ${date}.`);
      }
    } catch {
      cards.replaceChildren(...fallbackProducts.map(createCard));
      const date = fallbackProducts.find((product) => product.snapshot)?.snapshot;
      const suffix = date ? ` Snapshot dated ${date}.` : '';
      announce(block, 'snapshot', `Live commerce is unavailable. Showing read-only reference data.${suffix}`);
      disableActions(cards);
    }
  }

  document.addEventListener('strawberry:aircraft-selected', (event) => {
    if (!event.detail?.variant || event.detail.variant === config.variant) return;
    config.variant = event.detail.variant;
    block.dataset.variant = config.variant;
    heading.textContent = `Parts for ${config.variant}`;
    refresh();
  });

  await refresh();
}
