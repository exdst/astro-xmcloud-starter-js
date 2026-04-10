export const DEBOUNCE_TIME = 400;

export const DEFAULT_PAGE_SIZE = 6;

export const gridColsClass = (value = 3): string => {
  const cols = Number(value) || 3;
  const map: Record<number, string> = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
  };

  const baseClass = map[Math.max(1, Math.min(cols, 3))];

  // Always use 1 column on mobile, then apply the configured columns from md breakpoint
  return `grid-cols-1 md:${baseClass}`;
};
