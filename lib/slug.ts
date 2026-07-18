export function generateSlug(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}

export function ensureUniqueSlug(base: string, existing: string[]) {
  const normalized = generateSlug(base) || "my-business";
  const used = new Set(existing.map((slug) => slug.toLowerCase()));
  if (!used.has(normalized)) return normalized;
  let suffix = 2;
  while (used.has(`${normalized}-${suffix}`)) suffix += 1;
  return `${normalized}-${suffix}`;
}
