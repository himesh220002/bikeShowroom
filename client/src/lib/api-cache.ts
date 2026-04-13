type CacheEntry<T> = {
    data: T;
    timestamp: number;
};

const cache = new Map<string, CacheEntry<any>>();
const DEFAULT_TTL = 1000 * 60 * 5; // 5 minutes

export const apiCache = {
    get: <T>(key: string): T | null => {
        const entry = cache.get(key);
        if (!entry) return null;

        const isExpired = Date.now() - entry.timestamp > DEFAULT_TTL;
        if (isExpired) {
            cache.delete(key);
            return null;
        }

        return entry.data;
    },

    set: <T>(key: string, data: T): void => {
        cache.set(key, {
            data,
            timestamp: Date.now(),
        });
    },

    clear: (): void => {
        cache.clear();
    },

    delete: (key: string): void => {
        cache.delete(key);
    }
};
