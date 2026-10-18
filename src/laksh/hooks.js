import { useEffect, useRef, useState } from 'react';

const reduced = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/** Adds data-in="1" the first time the element scrolls into view (one-time entrance, never scrubbed). */
export const useReveal = (threshold = 0.12) => {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (reduced() || typeof IntersectionObserver === 'undefined') {
      el.dataset.in = '1';
      return undefined;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.dataset.in = '1';
            io.unobserve(e.target);
          }
        });
      },
      { threshold, rootMargin: '0px 0px -6% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return ref;
};

/** Counts from 0 to `value` once the element is visible. */
export const useCountUp = (value, duration = 1100) => {
  const ref = useRef(null);
  const [n, setN] = useState(reduced() ? value : 0);
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced()) return undefined;
    let raf = 0;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        io.disconnect();
        const t0 = performance.now();
        const tick = (t) => {
          const p = Math.min(1, (t - t0) / duration);
          setN(Math.round(value * (1 - Math.pow(1 - p, 3))));
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, duration]);
  return [ref, n];
};

/** Pointer-follow for buttons: sets --mx / --my (pixels), resets on leave. */
export const magnet = (strength = 0.22) => ({
  onPointerMove(e) {
    if (reduced() || e.pointerType === 'touch') return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) * strength;
    const y = (e.clientY - (r.top + r.height / 2)) * strength;
    e.currentTarget.style.setProperty('--mx', `${x.toFixed(1)}px`);
    e.currentTarget.style.setProperty('--my', `${y.toFixed(1)}px`);
  },
  onPointerLeave(e) {
    e.currentTarget.style.setProperty('--mx', '0px');
    e.currentTarget.style.setProperty('--my', '0px');
  },
});

/** Card tilt: sets --rx / --ry (degrees) and a glow position. */
export const tilt = (max = 5) => ({
  onPointerMove(e) {
    if (reduced() || e.pointerType === 'touch') return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    e.currentTarget.style.setProperty('--ry', `${((px - 0.5) * 2 * max).toFixed(2)}deg`);
    e.currentTarget.style.setProperty('--rx', `${(-(py - 0.5) * 2 * max).toFixed(2)}deg`);
    e.currentTarget.style.setProperty('--gx', `${(px * 100).toFixed(0)}%`);
    e.currentTarget.style.setProperty('--gy', `${(py * 100).toFixed(0)}%`);
  },
  onPointerLeave(e) {
    e.currentTarget.style.setProperty('--rx', '0deg');
    e.currentTarget.style.setProperty('--ry', '0deg');
  },
});

/** Pings each project URL (opaque no-cors request) and reports up/down with the round trip in ms. */
export const useLiveStatus = (projects) => {
  const [status, setStatus] = useState({});
  useEffect(() => {
    let alive = true;
    const targets = projects.filter((p) => p.url);
    targets.forEach(async (p) => {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 7000);
      const t0 = performance.now();
      try {
        await fetch(p.url, { mode: 'no-cors', cache: 'no-store', signal: ctrl.signal });
        if (alive) setStatus((s) => ({ ...s, [p.id]: { state: 'up', ms: Math.round(performance.now() - t0) } }));
      } catch {
        if (alive) setStatus((s) => ({ ...s, [p.id]: { state: 'down' } }));
      } finally {
        clearTimeout(timer);
      }
    });
    return () => {
      alive = false;
    };
    // The project list is a module constant; ping once per page load.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return status;
};

/** Which section id is currently near the top of the viewport. */
export const useActiveSection = (ids) => {
  const [active, setActive] = useState(ids[0]);
  const key = ids.join('|');
  useEffect(() => {
    const els = ids.map((id) => document.getElementById(`s-${id}`)).filter(Boolean);
    if (!els.length || typeof IntersectionObserver === 'undefined') return undefined;
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (hit) setActive(hit.target.id.replace(/^s-/, ''));
      },
      { rootMargin: '-18% 0px -70% 0px' }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return active;
};

/** Writes scroll progress (0..1) to --lk-progress on the root element. */
export const useScrollProgress = (rootRef) => {
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = rootRef.current;
      if (!el) return;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      el.style.setProperty('--lk-progress', max > 0 ? (window.scrollY / max).toFixed(4) : '0');
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [rootRef]);
};

export const safeStorage = {
  get(key) {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      /* private window or blocked storage: the page still works */
    }
  },
};
