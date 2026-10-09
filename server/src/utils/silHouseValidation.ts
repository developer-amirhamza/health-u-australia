export class SilHouseValidationError extends Error {}

export function isImageUrl(value: unknown): value is string {
  if (typeof value !== 'string' || value.length > 2048) return false;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password;
  } catch { return false; }
}

export function validateSilHouse(body: unknown) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw new SilHouseValidationError('House details are required');
  }
  const input = body as Record<string, unknown>;
  const address = typeof input.address === 'string' ? input.address.trim() : '';
  if (!address || address.length > 300) throw new SilHouseValidationError('Address is required (maximum 300 characters)');
  if (!isImageUrl(input.image)) throw new SilHouseValidationError('A valid HTTPS cover image URL is required');
  for (const field of ['bedrooms', 'bathrooms', 'parking', 'sortOrder'] as const) {
    if (!Number.isInteger(input[field]) || (input[field] as number) < 0 || (input[field] as number) > (field === 'sortOrder' ? 10000 : 100)) {
      throw new SilHouseValidationError(`${field} must be a whole number between 0 and ${field === 'sortOrder' ? 10000 : 100}`);
    }
  }
  if (typeof input.accessible !== 'boolean') throw new SilHouseValidationError('Accessibility must be true or false');
  if (typeof input.description !== 'string' || input.description.length > 20000) throw new SilHouseValidationError('Description must be text (maximum 20,000 characters)');
  if (!Array.isArray(input.gallery) || input.gallery.length > 30 || !input.gallery.every(isImageUrl)) {
    throw new SilHouseValidationError('Gallery must contain up to 30 valid HTTPS image URLs');
  }
  // Only editable fields are accepted; IDs and legacy links cannot be overwritten.
  return {
    address, image: input.image, bedrooms: input.bedrooms as number,
    bathrooms: input.bathrooms as number, parking: input.parking as number,
    accessible: input.accessible, description: input.description.trim(),
    gallery: input.gallery as string[], sortOrder: input.sortOrder as number,
  };
}
