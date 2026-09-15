import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const isDesktop = window.matchMedia('(min-width: 900px)');
const DEFAULT_LINKS = [
  ['Products', '/#products'],
  ['AOG Support', '/#aog-support'],
  ['Architecture', '/#architecture'],
  ['About', '/#about'],
];

function createLink(label, href, className) {
  const link = document.createElement('a');
  link.textContent = label;
  link.href = href;
  if (className) link.className = className;
  return link;
}

function createDefaultNavContent() {
  const brand = document.createElement('div');
  brand.className = 'nav-brand';
  const home = createLink('Strawberry Aviation Supply', '/', 'nav-brand-link');
  const logo = document.createElement('img');
  Object.assign(logo, {
    src: '/media/brand/strawberry-aviation-logo.svg',
    alt: 'Strawberry Aviation Supply',
    width: 292,
    height: 64,
  });
  home.replaceChildren(logo);
  brand.append(home);

  const sections = document.createElement('div');
  sections.className = 'nav-sections';
  const list = document.createElement('ul');
  DEFAULT_LINKS.forEach(([label, href]) => {
    const item = document.createElement('li');
    item.append(createLink(label, href));
    list.append(item);
  });
  sections.append(list);

  const tools = document.createElement('div');
  tools.className = 'nav-tools';
  tools.append(createLink('Request AOG support', '/#aog-support', 'nav-primary-action'));
  return [brand, sections, tools];
}

async function getNavContent() {
  const navMeta = getMetadata('nav');
  if (!navMeta) return createDefaultNavContent();
  try {
    const fragment = await loadFragment(new URL(navMeta, window.location).pathname);
    const children = fragment ? [...fragment.children] : [];
    if (children.length < 2) return createDefaultNavContent();
    ['brand', 'sections', 'tools'].forEach((name, index) => {
      children[index]?.classList.add(`nav-${name}`);
    });
    return children;
  } catch {
    return createDefaultNavContent();
  }
}

function setMenuState(nav, expanded) {
  nav.setAttribute('aria-expanded', String(expanded));
  const button = nav.querySelector('.nav-hamburger button');
  button.setAttribute('aria-expanded', String(expanded));
  button.setAttribute('aria-label', expanded ? 'Close navigation' : 'Open navigation');
  document.body.classList.toggle('nav-open', expanded && !isDesktop.matches);
}

function closeMenu(nav, returnFocus = false) {
  setMenuState(nav, false);
  if (returnFocus) nav.querySelector('.nav-hamburger button')?.focus();
}

/** @param {Element} block The header block element */
export default async function decorate(block) {
  const nav = document.createElement('nav');
  nav.id = 'nav';
  nav.setAttribute('aria-label', 'Primary navigation');
  nav.setAttribute('aria-expanded', 'false');

  const hamburger = document.createElement('div');
  hamburger.className = 'nav-hamburger';
  const menuButton = document.createElement('button');
  menuButton.type = 'button';
  menuButton.setAttribute('aria-controls', 'nav-menu');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open navigation');
  const menuIcon = document.createElement('span');
  menuIcon.className = 'nav-hamburger-icon';
  menuIcon.setAttribute('aria-hidden', 'true');
  menuButton.append(menuIcon);
  hamburger.append(menuButton);
  nav.append(hamburger, ...(await getNavContent()));

  const sections = nav.querySelector('.nav-sections');
  if (sections) sections.id = 'nav-menu';
  menuButton.addEventListener('click', () => {
    setMenuState(nav, nav.getAttribute('aria-expanded') !== 'true');
  });
  nav.addEventListener('click', (event) => { if (event.target.closest('a')) closeMenu(nav); });
  nav.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeMenu(nav, true); });
  isDesktop.addEventListener('change', () => closeMenu(nav));

  const wrapper = document.createElement('div');
  wrapper.className = 'nav-wrapper';
  wrapper.append(nav);
  block.replaceChildren(wrapper);
}
