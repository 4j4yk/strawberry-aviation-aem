function rowValue(row, index) {
  return row.children[index]?.textContent.trim() || '';
}

export default function decorate(block) {
  const options = [...block.children].map((row) => ({
    system: rowValue(row, 0),
    variant: rowValue(row, 1),
    description: rowValue(row, 2),
  })).filter(({ system, variant }) => system && variant);

  if (!options.length) return;

  const heading = document.createElement('h2');
  heading.textContent = 'Shop by aircraft system';
  const help = document.createElement('p');
  help.textContent = 'Select a system to see parts matched to its demonstration aircraft configuration.';
  const controls = document.createElement('div');
  controls.className = 'aircraft-compatibility-controls';
  controls.setAttribute('role', 'group');
  controls.setAttribute('aria-label', 'Filter parts by aircraft system');
  const panel = document.createElement('div');
  panel.className = 'aircraft-compatibility-panel';
  panel.setAttribute('aria-live', 'polite');

  function setPanel(option) {
    const variant = document.createElement('strong');
    variant.textContent = option.variant;
    const description = document.createElement('span');
    description.textContent = option.description || `${option.system} parts and service items`;
    panel.replaceChildren(variant, description);
  }

  options.forEach((option, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'aircraft-compatibility-option';
    button.textContent = option.system;
    button.setAttribute('aria-pressed', String(index === 0));
    button.addEventListener('click', () => {
      controls.querySelectorAll('button').forEach((item) => {
        item.setAttribute('aria-pressed', String(item === button));
      });
      setPanel(option);
      document.dispatchEvent(new CustomEvent('strawberry:aircraft-selected', { detail: option }));
    });
    controls.append(button);
  });

  setPanel(options[0]);
  block.replaceChildren(heading, help, controls, panel);
}
