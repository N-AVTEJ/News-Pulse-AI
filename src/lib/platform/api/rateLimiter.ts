const requestCounts: Map<string, { count: number; resetAt: number }> = new Map();

export function checkRateLimit(keyId: string, limitPerMinute: number = 60): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const current = requestCounts.get(keyId);

  if (!current || now > current.resetAt) {
    requestCounts.set(keyId, { count: 1, resetAt: now + 60000 });
    return { allowed: true, remaining: limitPerMinute - 1 };
  }

  if (current.count >= limitPerMinute) {
    return { allowed: false, remaining: 0 };
  }

  current.count++;
  return { allowed: true, remaining: limitPerMinute - current.count };
}
