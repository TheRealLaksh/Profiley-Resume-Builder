import { useSyncExternalStore } from 'react';

/** Subscribes to a CSS media query, so only one of the desktop/mobile layouts is ever mounted. */
export default function useMediaQuery(query) {
  return useSyncExternalStore(
    (notify) => {
      const mql = window.matchMedia(query);
      mql.addEventListener('change', notify);
      return () => mql.removeEventListener('change', notify);
    },
    () => window.matchMedia(query).matches,
    () => false
  );
}
