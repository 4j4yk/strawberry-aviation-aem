import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

function createLink(label, href) {
  const link = document.createElement('a');
  link.textContent = label;
  link.href = href;
  return link;
}

function createDefaultFooter() {
  const shell = document.createElement('div');
  shell.className = 'footer-shell';
  const identity = document.createElement('div');
  identity.className = 'footer-identity';
  const logo = document.createElement('img');
  Object.assign(logo, {
    src: '/media/brand/strawberry-aviation-logo.svg',
    alt: 'Strawberry Aviation Supply',
    width: 292,
    height: 64,
  });
  const summary = document.createElement('p');
  summary.textContent = 'Mission-ready aircraft parts and responsive AOG support.';
  identity.append(logo, summary);

  const navigation = document.createElement('nav');
  navigation.setAttribute('aria-label', 'Footer navigation');
  const heading = document.createElement('h2');
  heading.textContent = 'Explore';
  const list = document.createElement('ul');
  const links = [
    ['Products', '/#products'],
    ['AOG Support', '/#aog-support'],
    ['Architecture', '/#architecture'],
    ['About', '/#about'],
  ];
  links.forEach(([label, href]) => {
    const item = document.createElement('li');
    item.append(createLink(label, href));
    list.append(item);
  });
  navigation.append(heading, list);

  const action = document.createElement('div');
  action.className = 'footer-action';
  const actionHeading = document.createElement('h2');
  actionHeading.textContent = 'Aircraft on ground?';
  const actionText = document.createElement('p');
  actionText.textContent = 'Start a priority parts request with operational context.';
  const actionLink = createLink('Request AOG support', '/#aog-support');
  actionLink.className = 'footer-primary-action';
  action.append(actionHeading, actionText, actionLink);

  const legal = document.createElement('div');
  legal.className = 'footer-legal';
  legal.textContent = `© ${new Date().getFullYear()} Strawberry Aviation Supply. `
    + 'Fictional company and demonstration environment.';
  shell.append(identity, navigation, action, legal);
  return shell;
}

async function getFooterContent() {
  const footerMeta = getMetadata('footer');
  if (!footerMeta) return createDefaultFooter();
  try {
    const fragment = await loadFragment(new URL(footerMeta, window.location).pathname);
    if (!fragment?.firstElementChild) return createDefaultFooter();
    const wrapper = document.createElement('div');
    wrapper.className = 'footer-authored';
    while (fragment.firstElementChild) wrapper.append(fragment.firstElementChild);
    return wrapper;
  } catch {
    return createDefaultFooter();
  }
}

/** @param {Element} block The footer block element */
export default async function decorate(block) {
  block.replaceChildren(await getFooterContent());
}
