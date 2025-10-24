import { useSyncExternalStore } from 'react';

function getSnapshot(query: string): () => boolean {
    return function (): boolean {
        return window.matchMedia(query).matches;
    };
}

function subscribe(query: string): (callback: () => void) => () => void {
    return function (callback: () => void): () => void {
        const controller = new AbortController();
        const mediaQuery = window.matchMedia(query);

        mediaQuery.addEventListener('change', callback, {
            signal: controller.signal,
        });
        window.addEventListener('orientationchange', callback, {
            signal: controller.signal,
        });
        window.addEventListener('resize', callback, {
            signal: controller.signal,
        });

        return () => {
            controller.abort();
        };
    };
}

export const useMediaQuery = (query: string): boolean => {
    return useSyncExternalStore(subscribe(query), getSnapshot(query));
};
