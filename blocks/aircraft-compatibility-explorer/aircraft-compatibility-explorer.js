import { loadMotion, whenVisible } from '../../scripts/motion.js';

function rowValue(row, index) {
  return row.children[index]?.textContent.trim() || '';
}

export default function decorate(block) {
  const options = [...block.children].map((row) => ({
    system: rowValue(row, 0),
    variant: rowValue(row, 1),
    description: rowValue(row, 2),
  })).filter(({ system, variant }) => system && variant);

  const heading = document.createElement('h2');
  heading.textContent = 'Find parts by aircraft system';
  const help = document.createElement('p');
  help.textContent = 'Choose a system to focus the compatible Mage-OS catalog.';
  const controls = document.createElement('div');
  controls.className = 'aircraft-compatibility-controls';
  controls.setAttribute('role', 'group');
  controls.setAttribute('aria-label', 'Aircraft systems');
  const panel = document.createElement('div');
  panel.className = 'aircraft-compatibility-panel';
  panel.setAttribute('aria-live', 'polite');

  function showOption(option) {
    const variant = document.createElement('strong');
    variant.textContent = option.variant;
    const description = document.createElement('span');
    description.textContent = option.description;
    panel.replaceChildren(variant, description);
  }

  options.forEach((option, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'aircraft-compatibility-option';
    button.textContent = option.system;
    button.setAttribute('aria-pressed', String(index === 0));
    button.addEventListener('click', async () => {
      controls.querySelectorAll('button').forEach((item) => item.setAttribute('aria-pressed', 'false'));
      button.setAttribute('aria-pressed', 'true');
      showOption(option);
      const motion = await loadMotion();
      if (motion) {
        motion.animate(panel, {
          opacity: [0.3, 1], x: [-8, 0], duration: 280, ease: 'outQuad',
        });
      }
      document.dispatchEvent(new CustomEvent('strawberry:aircraft-selected', { detail: option }));
    });
    controls.append(button);
  });

  const initial = options[0];
  if (initial) showOption(initial);
  block.replaceChildren(heading, help, controls, panel);
  whenVisible(block, async () => {
    const motion = await loadMotion();
    if (motion) {
      motion.animate(controls.children, {
        opacity: [0, 1], y: [10, 0], delay: motion.stagger(55), duration: 320,
      });
    }
  });
}
