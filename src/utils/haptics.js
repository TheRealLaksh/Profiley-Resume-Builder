// A short buzz on touch devices that support it (Android Chrome). Silently does nothing elsewhere.
export const tap = (ms = 8) => {
  try {
    if (typeof navigator !== 'undefined' && navigator.vibrate && window.matchMedia('(pointer: coarse)').matches) navigator.vibrate(ms);
  } catch {
    // Vibration can be blocked by the browser or by settings; the tap still works.
  }
};
