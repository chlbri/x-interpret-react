import { vi } from 'vitest';

export async function advanceByTime(ms: number) {
  await Promise.resolve();
  vi.advanceTimersByTime(ms);
}
