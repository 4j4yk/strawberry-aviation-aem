import { loadMotion, whenVisible } from '../../scripts/motion.js';

export default function decorate(block) {
  const stages = [...block.children].map((row) => ({
    name: row.children[0]?.textContent.trim(),
    responsibility: row.children[1]?.textContent.trim(),
    state: row.children[2]?.textContent.trim().toLowerCase(),
  })).filter(({ name }) => name);
  const list = document.createElement('ol');
  list.className = 'commerce-architecture-stages';
  stages.forEach((stage) => {
    const item = document.createElement('li');
    item.dataset.state = stage.state || 'live';
    const name = document.createElement('strong');
    name.textContent = stage.name;
    const responsibility = document.createElement('span');
    responsibility.textContent = stage.responsibility;
    const state = document.createElement('small');
    state.textContent = stage.state || 'live';
    item.append(name, responsibility, state);
    list.append(item);
  });
  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'button secondary';
  toggle.textContent = 'Show outage path';
  toggle.setAttribute('aria-pressed', 'false');
  toggle.addEventListener('click', () => {
    const outage = toggle.getAttribute('aria-pressed') !== 'true';
    toggle.setAttribute('aria-pressed', String(outage));
    toggle.textContent = outage ? 'Show live path' : 'Show outage path';
    block.dataset.path = outage ? 'fallback' : 'live';
  });
  block.replaceChildren(list, toggle);
  whenVisible(block, async () => {
    const motion = await loadMotion();
    if (motion) {
      motion.animate(list.children, {
        opacity: [0, 1], y: [12, 0], delay: motion.stagger(90), duration: 360,
      });
    }
  });
}
