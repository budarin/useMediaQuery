# useMediaQuery

A modern React hook for media queries built with `useSyncExternalStore` for optimal performance and SSR compatibility.

> 🇷🇺 [Русская версия документации](README.ru.md)

## Features

- ✅ **SSR Safe** - No hydration mismatches
- ✅ **Performance Optimized** - Built on `useSyncExternalStore`
- ✅ **Automatic Updates** - Automatically responds to window resize, orientation changes, and all viewport updates
- ✅ **TypeScript Support** - Full type definitions
- ✅ **Modern React** - Compatible with React 18+
- ✅ **Zero Dependencies** - Lightweight implementation

## Installation

```bash
npm install @budarin/useMediaQuery
# or
pnpm add @budarin/useMediaQuery
# or
yarn add @budarin/useMediaQuery
```

## Usage

### Basic Example

```tsx
import { useMediaQuery } from '@budarin/useMediaQuery';

function App() {
    const isMobile = useMediaQuery('(max-width: 768px)');
    const isDark = useMediaQuery('(prefers-color-scheme: dark)');

    return (
        <div>
            <h1>{isMobile ? 'Mobile View' : 'Desktop View'}</h1>
            <p>Theme: {isDark ? 'Dark' : 'Light'}</p>
        </div>
    );
}
```

### Custom Hook Example

```tsx
import { useMediaQuery } from '@budarin/useMediaQuery';

// Create custom hooks for common breakpoints
export const useBreakpoints = () => {
    const isMobile = useMediaQuery('(max-width: 767px)');
    const isTablet = useMediaQuery(
        '(min-width: 768px) and (max-width: 1023px)'
    );
    const isDesktop = useMediaQuery('(min-width: 1024px)');

    return { isMobile, isTablet, isDesktop };
};

// Usage
function MyComponent() {
    const { isMobile, isTablet, isDesktop } = useBreakpoints();

    return (
        <div>
            {isMobile && <MobileView />}
            {isTablet && <TabletView />}
            {isDesktop && <DesktopView />}
        </div>
    );
}
```

## API

### `useMediaQuery(query: string): boolean`

**Parameters:**

- `query` (string) - CSS media query string

**Returns:**

- `boolean` - Whether the media query matches

## Why use this hook?

This hook is built on React's `useSyncExternalStore` instead of the traditional `useState` + `useEffect` pattern for several reasons:

**Issues:**

- Hydration mismatches between server and client
- Race conditions between `useState` and `useEffect`
- Stale state if media query changes before component mounts
- Poor SSR compatibility
- **React 18+ concurrent rendering issues** - State can become inconsistent during interrupted renders

### ✅ useSyncExternalStore Benefits

- **Synchronous synchronization** - Always up-to-date
- **SSR safe** - No hydration mismatches
- **No race conditions** - Store is always synchronized
- **Better performance** - React optimizes subscriptions
- **Future-proof** - Built for React 18+ concurrent features
- **Automatic viewport tracking** - `MediaQueryList.change` automatically fires on window resize, orientation changes, and any viewport update
- **Concurrent rendering safe** - No state inconsistencies during interrupted renders

### 🚨 Critical React 18+ Issue

With React 18+ concurrent features, traditional `useState` + `useEffect` approach can cause **state inconsistencies**:

```tsx
// ❌ Problematic with concurrent rendering
function useMediaQuery(query) {
    const [matches, setMatches] = useState(
        () => window.matchMedia(query).matches
    );

    useEffect(() => {
        const mediaQuery = window.matchMedia(query);
        const handler = (e) => setMatches(e.matches); // ⚠️ Can be called during interrupted render
        mediaQuery.addEventListener('change', handler);
        return () => mediaQuery.removeEventListener('change', handler);
    }, [query]);

    return matches; // ⚠️ May return stale state during concurrent updates
}
```

**The Problem:**

- React can interrupt renders in React 18+
- Media query changes can occur during interrupted renders
- `useState` updates can be applied out of order
- Component may render with inconsistent state

## TypeScript

Full TypeScript support included. No additional type definitions needed.

```tsx
import { useMediaQuery } from '@budarin/useMediaQuery';

// TypeScript automatically infers the return type
const isMobile: boolean = useMediaQuery('(max-width: 768px)');
```

## License

MIT

## Author

Vadim Budarin
