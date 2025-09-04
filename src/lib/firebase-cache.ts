// Simple in-memory cache for Firebase queries
interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

class FirebaseCache {
  private cache = new Map<string, CacheItem<any>>();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

  set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    // Check if expired
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data as T;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  // Generate cache key for Firebase queries
  generateKey(collection: string, id?: string, query?: any): string {
    const baseKey = `firebase:${collection}`;
    if (id) return `${baseKey}:${id}`;
    if (query) return `${baseKey}:${JSON.stringify(query)}`;
    return baseKey;
  }
}

export const firebaseCache = new FirebaseCache();
