import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const docs = [
  'site-map',
  'content-model',
  'block-contracts',
  'design-system',
  'acceptance-criteria',
  'architecture',
  'authoring',
  'phase-plan',
];

async function readDoc(name) {
  return readFile(new URL(`../docs/${name}.md`, import.meta.url), 'utf8');
}

test('the rebuild has a complete, non-empty documentation baseline', async () => {
  await Promise.all(docs.map(async (name) => {
    const contents = await readDoc(name);
    assert.ok(contents.trim().length > 100, `${name}.md must contain a useful contract`);
  }));
});

test('site map exposes the complete single-page visitor journey', async () => {
  const siteMap = await readDoc('site-map');
  ['products', 'assembly', 'aog-support', 'architecture', 'about'].forEach((landmark) => {
    assert.match(siteMap, new RegExp(`/#${landmark}`));
  });
  assert.match(siteMap, /single page/i);
});

test('status vocabulary has one documented source of truth', async () => {
  const contentModel = await readDoc('content-model');
  ['Live', 'Snapshot', 'Simulated', 'Planned'].forEach((status) => {
    assert.match(contentModel, new RegExp(`\\*\\*${status}\\*\\*:`));
  });
  assert.match(contentModel, /Snapshot cards are read-only/);
});

test('acceptance criteria distinguish repository, content, and production evidence', async () => {
  const criteria = await readDoc('acceptance-criteria');
  assert.match(criteria, /source, authored content, deployed code, and live behavior agree/i);
  assert.match(criteria, /No uncaught exception/);
  assert.match(criteria, /forced upstream outage/i);
});
