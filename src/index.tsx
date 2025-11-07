import { useSyncExternalStore } from 'react';

function createMediaQueryStore(query: string) {
    if (typeof window === 'undefined') {
        // SSR fallback
        return {
            subscribe: () => () => {},
            getSnapshot: () => false,
        };
    }

    const mediaQuery = window.matchMedia(query);

    return {
        subscribe: (callback: () => void) => {
            // MediaQueryList 'change' event automatically fires when:
            // - Window is resized
            // - Device orientation changes
            // - Any other viewport change that affects the media query result
            mediaQuery.addEventListener('change', callback);

            return () => {
                mediaQuery.removeEventListener('change', callback);
            };
        },
        getSnapshot: () => mediaQuery.matches,
    };
}

// Cache stores by query to avoid recreating MediaQueryList objects
const storeCache = new Map<string, ReturnType<typeof createMediaQueryStore>>();

function getStore(query: string) {
    if (!storeCache.has(query)) {
        storeCache.set(query, createMediaQueryStore(query));
    }
    return storeCache.get(query)!;
}

export const useMediaQuery = (query: string): boolean => {
    const store = getStore(query);
    return useSyncExternalStore(store.subscribe, store.getSnapshot);
};
