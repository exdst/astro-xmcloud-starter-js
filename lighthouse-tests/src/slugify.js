export function pageSlug(path) {
  if (!path || path === '/') return 'homepage';
  return path
    .replace(/^\/+|\/+$/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .toLowerCase();
}
