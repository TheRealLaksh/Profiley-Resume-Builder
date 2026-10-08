import { useEffect, useState } from 'react';

const isTyping = (el) => Boolean(el) && (/^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName) || el.isContentEditable);

/** True while the on-screen keyboard is covering the bottom of the page, so fixed bars can step aside. */
export default function useKeyboardOpen() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return undefined;

    const check = () => setOpen(isTyping(document.activeElement) && window.innerHeight - viewport.height > 120);
    const delayedCheck = () => setTimeout(check, 60);

    viewport.addEventListener('resize', check);
    window.addEventListener('focusin', delayedCheck);
    window.addEventListener('focusout', delayedCheck);
    return () => {
      viewport.removeEventListener('resize', check);
      window.removeEventListener('focusin', delayedCheck);
      window.removeEventListener('focusout', delayedCheck);
    };
  }, []);

  return open;
}
