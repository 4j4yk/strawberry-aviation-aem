import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const requiredBlocks = [
  'aircraft-compatibility-explorer',
  'aog-response-timeline',
  'aviation-catalog',
  'commerce-architecture-flow',
  'exploded-part',
];

test('all showcase blocks have JavaScript and scoped CSS entry points', async () => {
  await Promise.all(requiredBlocks.flatMap((block) => [
    readFile(new URL(`../blocks/${block}/${block}.js`, import.meta.url)),
    readFile(new URL(`../blocks/${block}/${block}.css`, import.meta.url)),
  ]));
});

test('motion respects user preference and remains locally hosted', async () => {
  const motion = await readFile(new URL('../scripts/motion.js', import.meta.url), 'utf8');
  assert.match(motion, /prefers-reduced-motion/);
  assert.match(motion, /vendor\/anime\.esm\.min\.js/);
  assert.doesNotMatch(motion, /https?:\/\//);
});

test('catalog snapshot mode is non-transactional', async () => {
  const catalog = await readFile(new URL('../blocks/aviation-catalog/aviation-catalog.js', import.meta.url), 'utf8');
  assert.match(catalog, /CURATED_SNAPSHOT|result\.source === 'LIVE_MAGE_OS'/);
  assert.match(catalog, /removeAttribute\('href'\)/);
  assert.match(catalog, /aria-disabled/);
});

test('global shell has accessible local fallbacks', async () => {
  const [header, footer] = await Promise.all([
    readFile(new URL('../blocks/header/header.js', import.meta.url), 'utf8'),
    readFile(new URL('../blocks/footer/footer.js', import.meta.url), 'utf8'),
  ]);
  assert.match(header, /createDefaultNavContent/);
  assert.match(header, /catch(?: \(error\))? \{[\s\S]*createDefaultNavContent/);
  assert.match(header, /aria-label', 'Primary navigation/);
  assert.match(header, /aria-expanded/);
  assert.match(footer, /createDefaultFooter/);
  assert.match(footer, /catch(?: \(error\))? \{[\s\S]*createDefaultFooter/);
  assert.match(footer, /Fictional company and demonstration environment/);
});

test('homepage landmarks agree with shell navigation', async () => {
  const [scripts, header, footer] = await Promise.all([
    readFile(new URL('../scripts/scripts.js', import.meta.url), 'utf8'),
    readFile(new URL('../blocks/header/header.js', import.meta.url), 'utf8'),
    readFile(new URL('../blocks/footer/footer.js', import.meta.url), 'utf8'),
  ]);
  ['products', 'aog-support', 'architecture', 'about'].forEach((id) => {
    assert.match(scripts, new RegExp(`['\"]${id}['\"]`));
    assert.match(header, new RegExp(`/#${id}`));
    assert.match(footer, new RegExp(`/#${id}`));
  });
  assert.match(scripts, /'exploded-part': 'assembly'/);
});

test('catalog source and interface state vocabularies remain bounded', async () => {
  const catalog = await readFile(new URL('../blocks/aviation-catalog/aviation-catalog.js', import.meta.url), 'utf8');
  assert.match(catalog, /LIVE_MAGE_OS/);
  assert.match(catalog, /source === 'LIVE_MAGE_OS' \? 'live' : 'snapshot'/);
  ['loading', 'live', 'snapshot'].forEach((state) => {
    assert.match(catalog, new RegExp(`announce\\(block, ['\"]${state}['\"]`));
  });
  assert.doesNotMatch(catalog, /announce\(block, ['"](?:simulated|planned)['"]/);
});
