import test from 'node:test';
import assert from 'node:assert/strict';
import { isImageUrl, validateSilHouse, SilHouseValidationError } from '../src/utils/silHouseValidation.js';

const validHouse = {
  address: ' Test Street Ryde NSW 2112 ', image: 'https://res.cloudinary.com/example/image/upload/cover.png',
  bedrooms: 3, bathrooms: 2, parking: 1, accessible: true,
  description: 'A supported living home',
  gallery: ['https://res.cloudinary.com/example/image/upload/gallery.png'], sortOrder: 2,
};

test('accepts HTTPS image URLs and normalises a house', () => {
  assert.equal(isImageUrl('/sil-houses/gallery/belmore_street/belmore1.png'), false);
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
