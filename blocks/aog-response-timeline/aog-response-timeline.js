import { loadMotion, whenVisible } from '../../scripts/motion.js';

export default function decorate(block) {
  const steps = [...block.children].map((row) => ({
    title: row.children[0]?.textContent.trim(),
    detail: row.children[1]?.textContent.trim(),
    status: row.children[2]?.textContent.trim().toLowerCase(),
  })).filter(({ title }) => title);
  const list = document.createElement('ol');
  list.className = 'aog-response-steps';
  steps.forEach((step, index) => {
    const item = document.createElement('li');
    item.dataset.status = step.status || 'implemented';
    const marker = document.createElement('span');
    marker.className = 'aog-response-index';
    marker.textContent = String(index + 1).padStart(2, '0');
    const content = document.createElement('div');
    const heading = document.createElement('h3');
    heading.textContent = step.title;
    const detail = document.createElement('p');
    detail.textContent = step.detail;
    content.append(heading, detail);
    item.append(marker, content);
    list.append(item);
  });
  const note = document.createElement('p');
  note.className = 'aog-response-note';
  note.textContent = 'Demonstration workflow using fictional data; some operational handoffs are simulated.';
  block.replaceChildren(list, note);
  whenVisible(block, async () => {
    const motion = await loadMotion();
    if (motion) {
      motion.animate(list.children, {
        opacity: [0.2, 1], x: [-16, 0], delay: motion.stagger(120), duration: 420, ease: 'outCubic',
      });
    }
  });
}
