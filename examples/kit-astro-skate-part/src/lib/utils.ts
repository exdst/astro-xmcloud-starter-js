export function getBaseUrl(): string {
  return import.meta.env.PUBLIC_SITE_URL || "http://localhost:3000";
}

export function getFullUrl(path: string): string {
  const baseUrl = getBaseUrl();
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
}
