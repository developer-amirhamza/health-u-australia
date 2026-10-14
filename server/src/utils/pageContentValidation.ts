export function matchesShape(value: unknown, template: unknown, field = ''): boolean {
  if (typeof template === 'string') {
    if (typeof value !== 'string' || value.length > 10000) return false;
    if (['image', 'src', 'href'].includes(field)) return value.startsWith('/') || value.startsWith('https://');
    return true;
  }
  if (Array.isArray(template)) return Array.isArray(value) && value.length <= 100 && value.every(item => template.length ? matchesShape(item, template[0], field) : typeof item === 'object' && item !== null && !Array.isArray(item) && Object.keys(item).length === 2 && typeof item.keyword === 'string' && item.keyword.length <= 10000 && typeof item.text === 'string' && item.text.length <= 10000);
  if (template && typeof template === 'object') {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
    const actual = value as Record<string, unknown>;
    const expected = template as Record<string, unknown>;
    return Object.keys(actual).every(key => key in expected) && Object.entries(expected).every(([key, shape]) => matchesShape(actual[key], shape, key));
  }
  return false;
}
