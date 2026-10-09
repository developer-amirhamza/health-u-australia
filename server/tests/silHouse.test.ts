import test from 'node:test';
import assert from 'node:assert/strict';
import { isImageUrl, validateSilHouse, SilHouseValidationError } from '../src/utils/silHouseValidation.js';

const validHouse = {
  address: ' Test Street Ryde NSW 2112 ', image: '/sil-houses/belmore.png',
  bedrooms: 3, bathrooms: 2, parking: 1, accessible: true,
  description: 'A supported living home',
  gallery: ['/sil-houses/gallery/belmore_street/belmore1.png'], sortOrder: 2,
};

test('accepts seeded and uploaded image paths and normalises a house', () => {
  assert.equal(isImageUrl('/sil-houses/gallery/belmore_street/belmore1.png'), true);
  assert.equal(isImageUrl('https://example.com/photo.jpg'), true);
  assert.deepEqual(validateSilHouse(validHouse), { ...validHouse, address: 'Test Street Ryde NSW 2112' });
});

test('rejects unsafe gallery paths and non-HTTPS images', () => {
  assert.equal(isImageUrl('/sil-houses/../secret.png'), false);
  assert.equal(isImageUrl('http://example.com/photo.jpg'), false);
  assert.throws(() => validateSilHouse({ ...validHouse, gallery: ['/sil-houses/../secret.png'] }), SilHouseValidationError);
});

test('rejects invalid room counts and missing address', () => {
  assert.throws(() => validateSilHouse({ ...validHouse, bedrooms: -1 }), SilHouseValidationError);
  assert.throws(() => validateSilHouse({ ...validHouse, address: ' ' }), SilHouseValidationError);
});
