import { useState, useEffect, useRef, type RefObject } from 'react';

export function useToggleWithClickOutside<T extends HTMLElement = HTMLElement>(
  initialVisible = false
): {
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  ref: RefObject<T | null>;
} {
  const [isVisible, setIsVisible] = useState(initialVisible);
  const ref = useRef<T | null>(null);

  useEffect(() => {
    if (!isVisible) return;

    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsVisible(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsVisible(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isVisible]);

  // Close on navigation (Astro page transitions)
  useEffect(() => {
    const handleNavigation = () => setIsVisible(false);
    document.addEventListener('astro:page-load', handleNavigation);
    return () => document.removeEventListener('astro:page-load', handleNavigation);
  }, []);

  return { isVisible, setIsVisible, ref };
}
