// Shared resumes are written by strangers, so anything that ends up in an
// href/src has to be vetted before it is rendered.

// "host:8080" is not a URL scheme, "javascript:alert(1)" is.
const SCHEME_PATTERN = /^[a-z][a-z0-9+.-]*:(?!\d)/i;

/**
 * Returns a normalised http(s) URL, or '' when the value is empty or unsafe
 * (javascript:, data:, vbscript:, ...). Scheme-less input such as
 * "linkedin.com/in/me" is upgraded to https.
 */
export const sanitizeUrl = (value) => {
  if (typeof value !== 'string') return '';
  const raw = value.trim();
  if (!raw) return '';

  // Browsers ignore whitespace/control characters inside a scheme ("java\tscript:").
  const compact = Array.from(raw)
    .filter((char) => char.charCodeAt(0) > 32 && char.charCodeAt(0) !== 127)
    .join('');
  const candidate = SCHEME_PATTERN.test(compact) ? raw : `https://${raw.replace(/^\/\//, '')}`;

  try {
    const url = new URL(candidate);
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.href : '';
  } catch {
    return '';
  }
};

const IMAGE_DATA_URL = /^data:image\/(png|jpe?g|webp|gif|avif|bmp);base64,[a-z0-9+/=]+$/i;

/** Profile photos are only ever uploaded, so only inline raster images are accepted. */
export const sanitizeImageSrc = (value) =>
  typeof value === 'string' && IMAGE_DATA_URL.test(value) ? value : '';
