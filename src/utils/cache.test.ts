import { TTLCache, memoize } from './cache';

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

describe('TTLCache', () => {
  it('stores and retrieves a value', () => {
    const cache = new TTLCache<string, number>();
    cache.set('a', 42);
    expect(cache.get('a')).toBe(42);
  });

  it('returns undefined for missing keys', () => {
    const cache = new TTLCache<string, number>();
    expect(cache.get('missing')).toBeUndefined();
  });

  it('expires entries after TTL', async () => {
    const cache = new TTLCache<string, string>({ ttlMs: 50 });
    cache.set('key', 'value');
    await sleep(60);
    expect(cache.get('key')).toBeUndefined();
  });

  it('has() returns false for expired entries', async () => {
    const cache = new TTLCache<string, string>({ ttlMs: 50 });
    cache.set('key', 'value');
    await sleep(60);
    expect(cache.has('key')).toBe(false);
  });

  it('delete removes an entry', () => {
    const cache = new TTLCache<string, number>();
    cache.set('x', 1);
    cache.delete('x');
    expect(cache.get('x')).toBeUndefined();
  });

  it('clear removes all entries', () => {
    const cache = new TTLCache<string, number>();
    cache.set('a', 1);
    cache.set('b', 2);
    cache.clear();
    expect(cache.size).toBe(0);
  });
});

describe('memoize', () => {
  it('calls fn once and caches result', async () => {
    const cache = new TTLCache<string, string>();
    const fn = jest.fn().mockResolvedValue('computed');

    const r1 = await memoize('key', cache, fn);
    const r2 = await memoize('key', cache, fn);

    expect(r1).toBe('computed');
    expect(r2).toBe('computed');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('calls fn again after TTL expiry', async () => {
    const cache = new TTLCache<string, string>({ ttlMs: 50 });
    const fn = jest.fn().mockResolvedValue('fresh');

    await memoize('key', cache, fn);
    await sleep(60);
    await memoize('key', cache, fn);

    expect(fn).toHaveBeenCalledTimes(2);
  });
});
