import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CacheKey = string;
export type CacheData = any;
export type CacheEntry = {
  data: CacheData;
  timestamp: number;
  ttl: number;
  tags?: string[];
};

export type CacheStats = {
  hits: number;
  misses: number;
  size: number;
  entries: number;
  byTag: Record<string, number>;
};

interface CacheStore {
  cache: Record<CacheKey, CacheEntry>;
  stats: CacheStats;
  maxSize: number;
  defaultTTL: number;
  set: (key: CacheKey, data: CacheData, ttl?: number, tags?: string[]) => void;
  get: (key: CacheKey) => CacheData | null;
  delete: (key: CacheKey) => void;
  clear: () => void;
  clearByTag: (tag: string) => void;
  clearByTags: (tags: string[]) => void;
  clearExpired: () => void;
  getStats: () => CacheStats;
  resetStats: () => void;
  setMaxSize: (size: number) => void;
  setDefaultTTL: (ttl: number) => void;
}

const DEFAULT_MAX_SIZE = 1000;
const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

const initialStats: CacheStats = {
  hits: 0,
  misses: 0,
  size: 0,
  entries: 0,
  byTag: {},
};

export const useCacheStore = create<CacheStore>()(
  persist(
    (set, get) => ({
      cache: {},
      stats: initialStats,
      maxSize: DEFAULT_MAX_SIZE,
      defaultTTL: DEFAULT_TTL,

      set: (key, data, ttl = get().defaultTTL, tags = []) => {
        const entry: CacheEntry = {
          data,
          timestamp: Date.now(),
          ttl,
          tags,
        };

        set((state) => {
          const newCache = { ...state.cache };
          const oldEntry = newCache[key];
          
          // Update size
          let sizeChange = 0;
          if (oldEntry) {
            sizeChange -= getEntrySize(oldEntry);
          }
          sizeChange += getEntrySize(entry);
          
          // Check if we need to clear space
          if (state.stats.size + sizeChange > state.maxSize) {
            clearOldestEntries(newCache, sizeChange);
          }

          // Update cache
          newCache[key] = entry;

          // Update stats
          const newStats = { ...state.stats };
          newStats.size += sizeChange;
          newStats.entries = Object.keys(newCache).length;
          tags.forEach((tag) => {
            newStats.byTag[tag] = (newStats.byTag[tag] || 0) + 1;
          });

          return {
            cache: newCache,
            stats: newStats,
          };
        });
      },

      get: (key) => {
        const entry = get().cache[key];
        if (!entry) {
          set((state) => ({
            stats: {
              ...state.stats,
              misses: state.stats.misses + 1,
            },
          }));
          return null;
        }

        if (isExpired(entry)) {
          get().delete(key);
          set((state) => ({
            stats: {
              ...state.stats,
              misses: state.stats.misses + 1,
            },
          }));
          return null;
        }

        set((state) => ({
          stats: {
            ...state.stats,
            hits: state.stats.hits + 1,
          },
        }));

        return entry.data;
      },

      delete: (key) => {
        set((state) => {
          const entry = state.cache[key];
          if (!entry) return state;

          const newCache = { ...state.cache };
          delete newCache[key];

          const newStats = { ...state.stats };
          newStats.size -= getEntrySize(entry);
          newStats.entries--;
          entry.tags?.forEach((tag) => {
            newStats.byTag[tag] = Math.max(0, (newStats.byTag[tag] || 0) - 1);
          });

          return {
            cache: newCache,
            stats: newStats,
          };
        });
      },

      clear: () => {
        set({
          cache: {},
          stats: initialStats,
        });
      },

      clearByTag: (tag) => {
        set((state) => {
          const newCache = { ...state.cache };
          const newStats = { ...state.stats };
          let sizeChange = 0;

          Object.entries(newCache).forEach(([key, entry]) => {
            if (entry.tags?.includes(tag)) {
              sizeChange -= getEntrySize(entry);
              delete newCache[key];
              newStats.entries--;
              entry.tags.forEach((t) => {
                newStats.byTag[t] = Math.max(0, (newStats.byTag[t] || 0) - 1);
              });
            }
          });

          newStats.size += sizeChange;
          return {
            cache: newCache,
            stats: newStats,
          };
        });
      },

      clearByTags: (tags) => {
        tags.forEach((tag) => get().clearByTag(tag));
      },

      clearExpired: () => {
        set((state) => {
          const newCache = { ...state.cache };
          const newStats = { ...state.stats };
          let sizeChange = 0;

          Object.entries(newCache).forEach(([key, entry]) => {
            if (isExpired(entry)) {
              sizeChange -= getEntrySize(entry);
              delete newCache[key];
              newStats.entries--;
              entry.tags?.forEach((tag) => {
                newStats.byTag[tag] = Math.max(0, (newStats.byTag[tag] || 0) - 1);
              });
            }
          });

          newStats.size += sizeChange;
          return {
            cache: newCache,
            stats: newStats,
          };
        });
      },

      getStats: () => {
        return get().stats;
      },

      resetStats: () => {
        set((state) => ({
          stats: {
            ...initialStats,
            size: state.stats.size,
            entries: state.stats.entries,
            byTag: state.stats.byTag,
          },
        }));
      },

      setMaxSize: (size) => {
        set({ maxSize: size });
        get().clearExpired();
      },

      setDefaultTTL: (ttl) => {
        set({ defaultTTL: ttl });
      },
    }),
    {
      name: 'cache-storage',
    }
  )
);

// Helper functions
function isExpired(entry: CacheEntry): boolean {
  return Date.now() - entry.timestamp > entry.ttl;
}

function getEntrySize(entry: CacheEntry): number {
  return JSON.stringify(entry).length;
}

function clearOldestEntries(
  cache: Record<CacheKey, CacheEntry>,
  requiredSpace: number
): void {
  const entries = Object.entries(cache).sort(
    (a, b) => a[1].timestamp - b[1].timestamp
  );

  let clearedSpace = 0;
  for (const [key] of entries) {
    if (clearedSpace >= requiredSpace) break;
    clearedSpace += getEntrySize(cache[key]);
    delete cache[key];
  }
} 