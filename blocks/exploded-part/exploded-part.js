import { loadMotion, whenVisible } from '../../scripts/motion.js';

function text(cell) { return cell?.textContent.trim() || ''; }

export default function decorate(block) {
  const rows = [...block.children];
  const mediaRow = rows.find((row) => row.querySelector('picture'));
  const parts = rows.filter((row) => !row.querySelector('picture')).map((row) => ({
    name: text(row.children[0]),
    detail: text(row.children[1]),
  })).filter(({ name }) => name);
  const figure = document.createElement('figure');
  figure.className = 'exploded-part-figure';
  const originalImage = mediaRow?.querySelector('img');
  const productImage = '/media/products/navcore-communication-unit-exploded.webp';
  const stage = document.createElement('div');
  stage.className = 'exploded-part-stage';
  stage.setAttribute('aria-label', 'Interactive exploded view of the fictional NavCore communication unit');
  ['housing', 'processor', 'connector'].forEach((part) => {
    const image = document.createElement('img');
    image.className = `exploded-part-layer exploded-part-layer-${part}`;
    image.src = productImage;
    image.alt = '';
    image.loading = 'lazy';
    image.decoding = 'async';
    image.setAttribute('aria-hidden', 'true');
    stage.append(image);
  });
  const accessibleImage = document.createElement('img');
  accessibleImage.className = 'exploded-part-accessible-image';
  accessibleImage.src = productImage;
  accessibleImage.alt = originalImage?.alt || 'Fictional NavCore communication unit in an exploded assembly view';
  accessibleImage.loading = 'lazy';
  accessibleImage.decoding = 'async';
  stage.append(accessibleImage);
  const controls = document.createElement('div');
  controls.className = 'exploded-part-controls';
  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'exploded-part-toggle';
  toggle.setAttribute('aria-pressed', 'false');
  toggle.textContent = 'Explode assembly';
  toggle.addEventListener('click', () => {
    const exploded = stage.classList.toggle('is-exploded');
    toggle.setAttribute('aria-pressed', String(exploded));
    toggle.textContent = exploded ? 'Assemble unit' : 'Explode assembly';
  });
  controls.append(toggle);
  figure.append(stage, controls);
  const caption = document.createElement('figcaption');
  caption.textContent = 'Illustrative component view — not maintenance documentation.';
  figure.append(caption);
  const list = document.createElement('ol');
  list.className = 'exploded-part-list';
  parts.forEach((part, index) => {
    const item = document.createElement('li');
    const button = document.createElement('button');
    button.type = 'button';
    const marker = document.createElement('span');
    marker.textContent = index + 1;
    button.append(marker, part.name);
    const detail = document.createElement('p');
    detail.textContent = part.detail;
    item.append(button, detail);
    button.setAttribute('aria-expanded', 'false');
    button.addEventListener('click', () => {
      const expanded = button.getAttribute('aria-expanded') === 'true';
      list.querySelectorAll('button').forEach((entry) => entry.setAttribute('aria-expanded', 'false'));
      button.setAttribute('aria-expanded', String(!expanded));
    });
    list.append(item);
  });
  block.replaceChildren(figure, list);
  whenVisible(block, async () => {
    const motion = await loadMotion();
    if (motion) {
      motion.animate(stage, {
        opacity: [0, 1], y: [16, 0], scale: [0.98, 1], duration: 520,
      });
      motion.animate(list.children, {
        opacity: [0, 1], x: [18, 0], delay: motion.stagger(70), duration: 360,
      });
    }
  });
}
