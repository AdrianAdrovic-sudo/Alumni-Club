// backend/src/utils/resetCodeStore.ts

type ResetEntry = {
  code: string;
  expiresAt: number;
};

const STORE = new Map<string, ResetEntry>();

function makeKey(username: string, email: string): string {
  return `${username.trim().toLowerCase()}|${email.trim().toLowerCase()}`;
}

/**
 * Snima kod za reset za kombinaciju username + email.
 * Kod važi 10 minuta.
 */
export function storeResetCode(username: string, email: string, code: string) {
  const key = makeKey(username, email);
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 min
  STORE.set(key, { code, expiresAt });
}

/**
 * Provjerava da li je kod ispravan i nije istekao.
 * Ako je ispravan, briše se iz memorije.
 */
export function verifyResetCode(
  username: string,
  email: string,
  code: string
): boolean {
  const key = makeKey(username, email);
  const entry = STORE.get(key);

  if (!entry) return false;
  if (Date.now() > entry.expiresAt) {
    STORE.delete(key);
    return false;
  }

  const ok = entry.code === code.trim();
  if (ok) STORE.delete(key);

  return ok;
}
