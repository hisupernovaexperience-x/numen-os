/**
 * Rate limiting en memoria por proceso — suficiente para un solo servidor / MVP.
 * En un deploy multi-instancia (ej. Vercel serverless) esto NO comparte estado entre
 * invocaciones: para producción a mayor escala, reemplazar por un store compartido
 * (ej. Upstash Redis) manteniendo la misma interfaz `consume(key)`.
 */

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

export interface RateLimitResult {
  allowed: boolean;
  retryAfterMs: number;
}

export function consumeRateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterMs: 0 };
  }

  if (bucket.count >= limit) {
    return { allowed: false, retryAfterMs: bucket.resetAt - now };
  }

  bucket.count += 1;
  return { allowed: true, retryAfterMs: 0 };
}
