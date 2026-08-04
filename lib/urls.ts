export function getPublicCatalogUrl(origin: string, slug: string) {
  return `${origin.replace(/\/$/, "")}/shop/${encodeURIComponent(slug)}`;
}
