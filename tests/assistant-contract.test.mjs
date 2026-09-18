import assert from 'node:assert/strict';
import test from 'node:test';
import {
  buildGroundedPrompt,
  generatedText,
  parseAssistantRequest,
  retrieveKnowledge,
  selectProducts,
} from '../gateway/src/assistant.ts';

const products = [
  {
    sku: 'SAS-HYD-1001',
    name: 'AeroFlow Hydraulic Pump',
    formattedPrice: '$8,750.00',
    availability: 'IN_STOCK',
    url: 'https://store.ajayk.xyz/aeroflow-hydraulic-pump.html',
  },
  {
    sku: 'SAS-AVN-1003',
    name: 'NavCore Communication Unit',
    formattedPrice: '$12,900.00',
    availability: 'IN_STOCK',
    url: 'https://store.ajayk.xyz/navcore-communication-unit.html',
  },
];

test('assistant input is bounded and normalized', () => {
  assert.deepEqual(parseAssistantRequest({ question: '  Find the pump  ' }), {
    question: 'Find the pump',
    variant: 'SAR-90-200',
  });
  assert.throws(() => parseAssistantRequest({ question: 'x' }), /at least 3 characters/);
  assert.throws(() => parseAssistantRequest({ question: 'Find pump', variant: '../../admin' }), /invalid/);
});

test('retrieval and product selection are deterministic', () => {
  const passages = retrieveKnowledge('Explain manager approval in the AOG workflow');
  assert.equal(passages[0].id, 'aog-workflow');
  assert.deepEqual(selectProducts('Find SAS-HYD-1001 hydraulic pump', products).map(({ sku }) => sku), [
    'SAS-HYD-1001',
  ]);
});

test('grounded prompt contains sources, commerce facts, and safety boundaries', () => {
  const passages = retrieveKnowledge('hydraulic compatibility');
  const messages = buildGroundedPrompt('Which hydraulic pump fits?', passages, [products[0]], 'LIVE_MAGE_OS');
  assert.match(messages[0].content, /Never claim certified compatibility/);
  assert.match(messages[1].content, /SAS-HYD-1001/);
  assert.match(messages[1].content, /Approved sources/);
  assert.equal(generatedText({ response: ' Grounded response. ' }), 'Grounded response.');
  assert.equal(generatedText({}), null);
});
