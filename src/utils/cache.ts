/**
 * Simple in-memory TTL cache for memoizing expensive operations
 * such as repeated GitHub API calls within a single action run.
 */

export interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

export interface CacheOptions {
  ttlMs?: number;
}

const DEFAULT_TTL_MS = 60_000; // 1 minute

export class TTLCache<K, V> {
  private readonly store = new Map<K, CacheEntry<V>>();
  private readonly ttlMs: number;

  constructor(options: CacheOptions = {}) {
    this.ttlMs = options.ttlMs ?? DEFAULT_TTL_MS;
  }

  set(key: K, value: V): void {
    this.store.set(key, {
      value,
      expiresAt: Date.now() + this.ttlMs,
    });
  }

  get(key: K): V | undefined {
    const entry = this.store.get(key);
    if (!entry) return undefined;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return undefined;
    }
    return entry.value;
  }

  has(key: K): boolean {
    return this.get(key) !== undefined;
  }

  delete(key: K): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }

  get size(): number {
    return this.store.size;
  }
}

export async function memoize<K, V>(
  key: K,
  cache: TTLCache<K, V>,
  fn: () => Promise<V>
): Promise<V> {
  const cached = cache.get(key);
  if (cached !== undefined) return cached;
  const value = await fn();
  cache.set(key, value);
  return value;
}
