// One definition of "phone" for the whole app (JS and CSS agree via the Tailwind `phone`/`desk` variants).
// A phone held sideways is still a phone: it is wider than 768px but short and touch-driven.
export const PHONE_QUERY = '(max-width: 767px), (pointer: coarse) and (max-height: 500px)';
export const DESKTOP_QUERY = '(min-width: 768px) and (min-height: 501px), (min-width: 768px) and (pointer: fine)';
