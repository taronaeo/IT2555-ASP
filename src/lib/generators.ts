import { browser } from '$app/environment';

export function generateAPIKey() {
  let result = '';

  const size = 16;
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_-+?/|';
  const randomValues = new Uint8Array(size);

  if (browser) window.crypto.getRandomValues(randomValues);
  for (let i = 0; i < size; i++) {
    const randomIndex = Math.floor((randomValues[i] / 256) * characters.length);
    result += characters.charAt(randomIndex);
  }

  return result;
}
