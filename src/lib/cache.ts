const cache = new Map<string, { data: unknown; expiry: number }>();

export function getCache<T>(
  key: string,
  supplier: () => Promise<T>,
  ttl = 60_000
): Promise<T> {
  const hit = cache.get(key);
  if (hit && hit.expiry > Date.now()) return Promise.resolve(hit.data as T);

  return supplier().then((fresh) => {
    cache.set(key, { data: fresh, expiry: Date.now() + ttl });
    return fresh;
  });
}
