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
  const picture = mediaRow?.querySelector('picture');
  if (picture) figure.append(picture);
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
      motion.animate(list.children, {
        opacity: [0, 1], x: [18, 0], delay: motion.stagger(70), duration: 360,
      });
    }
  });
}
