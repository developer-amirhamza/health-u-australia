import { test } from 'node:test';
import assert from 'node:assert/strict';
import { matchesShape } from '../src/utils/pageContentValidation.js';
import { ndisContent } from '../src/pages/ndis/content.js';
import { compassionContent } from '../src/pages/compassion/content.js';
import { feedbackContent } from '../src/pages/feedback/content.js';
import { aboutContent, careerContent, contactContent } from '../src/pages/siteContent.js';

for (const [slug, original] of [
  ['ndis', ndisContent],
  ['compassion', compassionContent],
  ['feedback', feedbackContent],
] as const) {
  test(`${slug} accepts adding, deleting and reordering repeatable content`, () => {
    const changed = structuredClone(original) as Record<string, unknown>;
    const key = slug === 'ndis' ? 'sections' : slug === 'compassion' ? 'services' : 'types';
    const items = changed[key] as object[];
    changed[key] = [...items.slice(1).reverse(), items[0], structuredClone(items[0])];
    assert.equal(matchesShape(changed, original), true);
    changed[key] = [];
    assert.equal(matchesShape(changed, original), true);
  });
}

test('NDIS accepts bullets newly added to an originally empty list', () => {
  const changed = structuredClone(ndisContent);
  changed.sections[0].bullets.push({ keyword: 'New:', text: 'Additional support' });
  assert.equal(matchesShape(changed, ndisContent), true);
});

test('rejects incomplete new image items', () => {
  const changed = structuredClone(compassionContent);
  changed.images.push({ src: '', alt: 'New image' });
  assert.equal(matchesShape(changed, compassionContent), false);
});

for (const [slug, original, key] of [
  ['about', aboutContent, 'sections'],
  ['career', careerContent, 'jobs'],
  ['contact', contactContent, 'offices'],
] as const) {
  test(`${slug} accepts adding, deleting and reordering entries`, () => {
    const changed = structuredClone(original) as Record<string, unknown>;
    const items = changed[key] as object[];
    changed[key] = [...items.slice(1), structuredClone(items[0])];
    assert.equal(matchesShape(changed, original), true);
    changed[key] = [];
    assert.equal(matchesShape(changed, original), true);
  });
}
