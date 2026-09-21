const DEFAULT_GATEWAY = 'https://strawberry-catalog-gateway.ajaykhampariya14.workers.dev';
const DEFAULT_STOREFRONT = 'https://store.ajayk.xyz';
const DEFAULT_VARIANT = 'SAR-90-200';

function safeOrigin(value, fallback) {
  try {
    const url = new URL(value || fallback);
    if (url.protocol !== 'https:' && !['localhost', '127.0.0.1'].includes(url.hostname)) throw new Error();
    return url.origin;
  } catch {
    return fallback;
  }
}

function configFrom(block) {
  const config = {
    gateway: DEFAULT_GATEWAY,
    storefront: DEFAULT_STOREFRONT,
    variant: DEFAULT_VARIANT,
  };
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const key = cells[0]?.textContent.trim().toLowerCase();
    const value = cells[1]?.textContent.trim();
    if (key === 'assistant gateway') config.gateway = safeOrigin(value, DEFAULT_GATEWAY);
    if (key === 'storefront') config.storefront = safeOrigin(value, DEFAULT_STOREFRONT);
    if (key === 'aircraft variant') config.variant = value || DEFAULT_VARIANT;
  });
  return config;
}

function safeLink(value, origins) {
  try {
    const url = new URL(value);
    return origins.includes(url.origin) ? url.href : null;
  } catch {
    return null;
  }
}

function citationList(citations, allowedOrigins) {
  const list = document.createElement('ol');
  list.className = 'parts-assistant-citations';
  citations.forEach((citation) => {
    const href = safeLink(citation.url, allowedOrigins);
    if (!href) return;
    const item = document.createElement('li');
    const link = document.createElement('a');
    link.href = href;
    link.textContent = citation.title;
    const section = document.createElement('span');
    section.textContent = citation.section;
    item.append(link, section);
    list.append(item);
  });
  return list;
}

function productList(products, storefront) {
  const list = document.createElement('ul');
  list.className = 'parts-assistant-products';
  products.forEach((product) => {
    const href = safeLink(product.url, [storefront]);
    if (!href) return;
    const item = document.createElement('li');
    const link = document.createElement('a');
    link.href = href;
    link.textContent = `${product.name} · ${product.sku}`;
    const detail = document.createElement('span');
    detail.textContent = `${product.formattedPrice || 'Price unavailable'} · ${product.availability.replaceAll('_', ' ').toLowerCase()}`;
    item.append(link, detail);
    list.append(item);
  });
  return list;
}

export default async function decorate(block) {
  const config = configFrom(block);
  const section = document.createElement('section');
  section.className = 'parts-assistant-shell';
  section.setAttribute('aria-labelledby', 'parts-assistant-heading');

  const intro = document.createElement('div');
  intro.className = 'parts-assistant-intro';
  const kicker = document.createElement('p');
  kicker.className = 'parts-assistant-kicker';
  kicker.textContent = 'Grounded assistance';
  const heading = document.createElement('h2');
  heading.id = 'parts-assistant-heading';
  heading.textContent = 'Ask Strawberry Scout';
  const description = document.createElement('p');
  description.textContent = 'Ask about fictional parts, compatibility boundaries, or the governed AOG process. Answers cite approved guidance and current read-only catalog facts.';
  const boundary = document.createElement('p');
  boundary.className = 'parts-assistant-boundary';
  boundary.textContent = 'Read-only demonstration · No certified compatibility · Human approval required';
  intro.append(kicker, heading, description, boundary);

  const form = document.createElement('form');
  const label = document.createElement('label');
  label.htmlFor = 'parts-assistant-question';
  label.textContent = 'What do you need help with?';
  const fieldRow = document.createElement('div');
  fieldRow.className = 'parts-assistant-field';
  const input = document.createElement('input');
  input.id = 'parts-assistant-question';
  input.name = 'question';
  input.type = 'text';
  input.required = true;
  input.minLength = 3;
  input.maxLength = 600;
  input.autocomplete = 'off';
  input.placeholder = 'Example: Which hydraulic pump is listed for SAR-90-200?';
  const submit = document.createElement('button');
  submit.type = 'submit';
  submit.textContent = 'Ask Scout';
  fieldRow.append(input, submit);
  const suggestions = document.createElement('div');
  suggestions.className = 'parts-assistant-suggestions';
  ['Find the hydraulic pump', 'Explain the AOG approval flow', 'Who owns catalog and checkout?'].forEach((text) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = text;
    button.addEventListener('click', () => {
      input.value = text;
      input.focus();
    });
    suggestions.append(button);
  });
  form.append(label, fieldRow, suggestions);

  const result = document.createElement('div');
  result.className = 'parts-assistant-result';
  result.setAttribute('role', 'status');
  result.setAttribute('aria-live', 'polite');
  result.hidden = true;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    submit.disabled = true;
    submit.textContent = 'Checking…';
    result.hidden = false;
    result.classList.remove('is-error');
    result.replaceChildren('Retrieving approved guidance and current catalog facts…');
    try {
      const response = await fetch(`${config.gateway}/assistant`, {
        method: 'POST',
        credentials: 'omit',
        headers: { accept: 'application/json', 'content-type': 'application/json' },
        body: JSON.stringify({ question: input.value.trim(), variant: config.variant }),
        signal: AbortSignal.timeout(15000),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || `Assistant returned ${response.status}`);
      const answer = document.createElement('p');
      answer.className = 'parts-assistant-answer';
      answer.textContent = payload.answer;
      const meta = document.createElement('p');
      meta.className = 'parts-assistant-meta';
      meta.textContent = `${payload.generatedBy === 'workers-ai' ? 'AI response' : 'Bounded fallback'} · ${payload.commerceSource === 'LIVE_MAGE_OS' ? 'Live Mage-OS facts' : 'Dated catalog snapshot'}`;
      const content = [answer, meta];
      if (payload.products?.length) content.push(productList(payload.products, config.storefront));
      if (payload.citations?.length) {
        content.push(citationList(
          payload.citations,
          [window.location.origin, config.storefront],
        ));
      }
      const aog = document.createElement('a');
      aog.className = 'parts-assistant-aog';
      aog.href = `${config.storefront}/aircraft-on-ground-service`;
      aog.textContent = 'Continue to governed AOG request';
      content.push(aog);
      result.replaceChildren(...content);
    } catch (error) {
      result.classList.add('is-error');
      let message = 'The assistant is temporarily unavailable.';
      if (error instanceof Error) message = error.message;
      if (error?.name === 'TimeoutError') message = 'Scout is taking longer than expected. Please try again.';
      result.textContent = message;
    } finally {
      submit.disabled = false;
      submit.textContent = 'Ask Scout';
    }
  });

  section.append(intro, form, result);
  block.replaceChildren(section);
}
