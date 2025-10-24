# useMediaQuery

Современный React хук для медиа-запросов, построенный на `useSyncExternalStore` для оптимальной производительности и совместимости с SSR.

> 🇺🇸 [English documentation](README.md)

## Возможности

- ✅ **SSR Безопасный** - Нет рассинхронизации при гидратации
- ✅ **Оптимизированная производительность** - Построен на `useSyncExternalStore`
- ✅ **События окна** - Реагирует на события `resize` и `orientationchange`
- ✅ **Поддержка TypeScript** - Полные определения типов
- ✅ **Современный React** - Совместим с React 18+
- ✅ **Нулевые зависимости** - Легковесная реализация

## Установка

```bash
npm install @budarin/useMediaQuery
# или
pnpm add @budarin/useMediaQuery
# или
yarn add @budarin/useMediaQuery
```

## Использование

### Базовый пример

```tsx
import { useMediaQuery } from '@budarin/useMediaQuery';

function App() {
    const isMobile = useMediaQuery('(max-width: 768px)');
    const isDark = useMediaQuery('(prefers-color-scheme: dark)');

    return (
        <div>
            <h1>{isMobile ? 'Мобильный вид' : 'Десктопный вид'}</h1>
            <p>Тема: {isDark ? 'Темная' : 'Светлая'}</p>
        </div>
    );
}
```

### Продвинутые примеры

```tsx
import { useMediaQuery } from '@budarin/useMediaQuery';

function ResponsiveComponent() {
    const isSmall = useMediaQuery('(max-width: 640px)');
    const isMedium = useMediaQuery(
        '(min-width: 641px) and (max-width: 1024px)'
    );
    const isLarge = useMediaQuery('(min-width: 1025px)');
    const isLandscape = useMediaQuery('(orientation: landscape)');
    const prefersReducedMotion = useMediaQuery(
        '(prefers-reduced-motion: reduce)'
    );

    return (
        <div>
            {isSmall && <MobileLayout />}
            {isMedium && <TabletLayout />}
            {isLarge && <DesktopLayout />}

            {isLandscape && <LandscapeWarning />}

            <div
                style={{
                    animation: prefersReducedMotion ? 'none' : 'fadeIn 0.3s',
                }}
            >
                Контент
            </div>
        </div>
    );
}
```

### Пример с кастомным хуком

```tsx
import { useMediaQuery } from '@budarin/useMediaQuery';

// Создаем кастомные хуки для стандартных брейкпоинтов
export const useBreakpoints = () => {
    const isMobile = useMediaQuery('(max-width: 767px)');
    const isTablet = useMediaQuery(
        '(min-width: 768px) and (max-width: 1023px)'
    );
    const isDesktop = useMediaQuery('(min-width: 1024px)');

    return { isMobile, isTablet, isDesktop };
};

// Использование
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

**Параметры:**

- `query` (string) - CSS медиа-запрос

**Возвращает:**

- `boolean` - Соответствует ли медиа-запрос

## Почему следует использовать именно этот хук?

Этот хук построен на React `useSyncExternalStore` вместо традиционного паттерна `useState` + `useEffect` по нескольким причинам:

**Проблемы:**

- Рассинхронизация при гидратации между сервером и клиентом
- Состояния гонки между `useState` и `useEffect`
- Устаревшее состояние, если медиа-запрос изменился до монтирования компонента
- Плохая совместимость с SSR
- **Отсутствие событий окна** - Не реагирует на `resize` и `orientationchange`
- **Проблемы с concurrent рендерингом в React 18+** - Состояние может стать неконсистентным во время прерванных рендеров

### ✅ Преимущества useSyncExternalStore

- **Синхронная синхронизация** - Всегда актуальное состояние
- **SSR безопасность** - Нет рассинхронизации при гидратации
- **Нет состояний гонки** - Store всегда синхронизирован
- **Лучшая производительность** - React оптимизирует подписки
- **Готовность к будущему** - Построен для React 18+ concurrent функций
- **Полное покрытие событий** - Реагирует на `resize`, `orientationchange` И изменения медиа-запросов
- **Безопасность concurrent рендеринга** - Нет неконсистентности состояния во время прерванных рендеров

### 🚨 Критическая проблема React 18+

С concurrent функциями React 18+ традиционный подход `useState` + `useEffect` может вызвать **неконсистентность состояния**:

```tsx
// ❌ Проблематично с concurrent рендерингом
function useMediaQuery(query) {
    const [matches, setMatches] = useState(
        () => window.matchMedia(query).matches
    );

    useEffect(() => {
        const mediaQuery = window.matchMedia(query);
        const handler = (e) => setMatches(e.matches); // ⚠️ Может быть вызван во время прерванного рендера
        mediaQuery.addEventListener('change', handler);
        return () => mediaQuery.removeEventListener('change', handler);
    }, [query]);

    return matches; // ⚠️ Может вернуть устаревшее состояние во время concurrent обновлений
}
```

**Проблема:**

- React может прерывать рендеры в React 18+
- Изменения медиа-запросов могут происходить во время прерванных рендеров
- Обновления `useState` могут применяться не в том порядке
- Компонент может отрендериться с неконсистентным состоянием

**Решение:**

- `useSyncExternalStore` гарантирует, что состояние всегда синхронизировано с внешним источником
- Нет состояний гонки во время concurrent рендеринга
- Гарантированная консистентность даже с прерванными рендерами

## TypeScript

Полная поддержка TypeScript включена. Дополнительные определения типов не нужны.

```tsx
import { useMediaQuery } from '@budarin/useMediaQuery';

// TypeScript автоматически выводит тип возвращаемого значения
const isMobile: boolean = useMediaQuery('(max-width: 768px)');
```

## Лицензия

MIT

## Автор

Vadim Budarin
