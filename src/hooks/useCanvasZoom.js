import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const round2 = (value) => Math.round(value * 100) / 100;

/**
 * Zoom state for the page canvas.
 *
 * - Callback refs (`setContainer`, `setContent`) mean listeners attach whenever the
 *   elements actually mount, however late (after loading screens, tab switches, ...).
 * - Until the user zooms by hand the page is "fitted": scaled to the container width,
 *   so it is sensible on a phone, a laptop and an ultrawide alike.
 */
export default function useCanvasZoom({ min = 0.3, max = 2, maxFit = 1, gutter = 48 } = {}) {
  const [container, setContainer] = useState(null);
  const [content, setContent] = useState(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [contentSize, setContentSize] = useState({ width: 0, height: 0 });
  const [manualZoom, setManualZoom] = useState(null); // null = fit to width

  useLayoutEffect(() => {
    if (!container) return;
    const observer = new ResizeObserver(() => setContainerWidth(container.clientWidth));
    observer.observe(container); // fires once straight away, which sets the initial width
    return () => observer.disconnect();
  }, [container]);

  useLayoutEffect(() => {
    if (!content) return;
    const measure = () => setContentSize({ width: content.offsetWidth, height: content.offsetHeight });
    const observer = new ResizeObserver(measure);
    observer.observe(content);
    return () => observer.disconnect();
  }, [content]);

  const fitZoom = contentSize.width > 0 && containerWidth > 0
    ? clamp(round2((containerWidth - gutter * 2) / contentSize.width), min, maxFit)
    : 1;
  const zoom = manualZoom ?? fitZoom;

  // Event handlers read the latest zoom through a ref so they never go stale.
  const zoomRef = useRef(zoom);
  useEffect(() => {
    zoomRef.current = zoom;
  }, [zoom]);

  const setZoom = useCallback((value) => setManualZoom(clamp(round2(value), min, max)), [min, max]);
  const zoomIn = useCallback(() => setZoom(zoomRef.current + 0.1), [setZoom]);
  const zoomOut = useCallback(() => setZoom(zoomRef.current - 0.1), [setZoom]);
  const fit = useCallback(() => setManualZoom(null), []);
  const actualSize = useCallback(() => setManualZoom(1), []);

  // Ctrl/Cmd + wheel (also what trackpad pinch sends) zooms the page instead of the browser.
  useEffect(() => {
    if (!container) return;
    const onWheel = (e) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      setZoom(zoomRef.current - e.deltaY * 0.0025);
    };
    container.addEventListener('wheel', onWheel, { passive: false });
    return () => container.removeEventListener('wheel', onWheel);
  }, [container, setZoom]);

  // Two-finger pinch zoom for touch screens.
  useEffect(() => {
    if (!container) return;
    let startDistance = 0;
    let startZoom = 1;
    const distance = (touches) => Math.hypot(touches[0].clientX - touches[1].clientX, touches[0].clientY - touches[1].clientY);

    const onTouchStart = (e) => {
      if (e.touches.length === 2) {
        startDistance = distance(e.touches);
        startZoom = zoomRef.current;
      }
    };
    const onTouchMove = (e) => {
      if (e.touches.length === 2 && startDistance > 0) {
        e.preventDefault();
        setZoom(startZoom * (distance(e.touches) / startDistance));
      }
    };
    const onTouchEnd = () => { startDistance = 0; };

    container.addEventListener('touchstart', onTouchStart, { passive: true });
    container.addEventListener('touchmove', onTouchMove, { passive: false });
    container.addEventListener('touchend', onTouchEnd, { passive: true });
    return () => {
      container.removeEventListener('touchstart', onTouchStart);
      container.removeEventListener('touchmove', onTouchMove);
      container.removeEventListener('touchend', onTouchEnd);
    };
  }, [container, setZoom]);

  return {
    setContainer, setContent,
    zoom, isFit: manualZoom === null, min, max,
    contentSize, zoomIn, zoomOut, setZoom, fit, actualSize
  };
}
