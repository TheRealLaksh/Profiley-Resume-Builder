const MAX_FILE_BYTES = 12 * 1024 * 1024;

/**
 * Reads an image file and returns a JPEG data URL no larger than `maxSide` px.
 * A raw phone photo can be 5 MB+, which overflows localStorage (~5 MB) and the
 * 1 MB Firestore document limit used by shared links, so it is shrunk up front.
 */
export const fileToResizedDataUrl = async (file, { maxSide = 640, quality = 0.86 } = {}) => {
  if (!file.type.startsWith('image/')) throw new Error('That file is not an image.');
  if (file.size > MAX_FILE_BYTES) throw new Error('That image is over 12 MB. Pick a smaller one.');

  const bitmap = await createImageBitmap(file).catch(() => {
    throw new Error("This image format isn't supported. Try a JPG or PNG.");
  });

  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffffff'; // flatten transparency so PNG logos don't turn black in JPEG
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close?.();

  return canvas.toDataURL('image/jpeg', quality);
};
