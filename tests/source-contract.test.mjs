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

test('all showcase blocks have JavaScript and CSS entry points', async () => {
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
