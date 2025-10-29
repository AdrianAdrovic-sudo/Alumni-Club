export function paginate<T>(items: T[], page = 1, limit = 10) {
  const p = Math.max(1, Number(page) || 1);
  const l = Math.max(1, Number(limit) || 10);
  const start = (p - 1) * l;
  const data = items.slice(start, start + l);
  return { data, page: p, limit: l, total: items.length };
}
