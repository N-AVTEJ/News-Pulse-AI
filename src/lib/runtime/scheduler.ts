import { setSchedulerState } from './healthMonitor';

let activeTimer: NodeJS.Timeout | null = null;
let currentMode: 'MANUAL' | 'INTERVAL' | 'DEV' | 'PROD' = 'MANUAL';

export function startScheduler(
  intervalMs: number = 300000, // Default 5 minutes
  mode: 'MANUAL' | 'INTERVAL' | 'DEV' | 'PROD' = 'INTERVAL',
  taskCallback?: () => Promise<void>
): void {
  stopScheduler();
  currentMode = mode;
  setSchedulerState(true, mode);

  if (mode !== 'MANUAL' && taskCallback) {
    activeTimer = setInterval(async () => {
      try {
        await taskCallback();
      } catch (err: unknown) {
        console.error('[Scheduler] Interval execution error:', err);
      }
    }, intervalMs);
  }

  console.log(`[Scheduler] Started scheduler in mode ${mode} (Interval: ${intervalMs}ms)`);
}

export function stopScheduler(): void {
  if (activeTimer) {
    clearInterval(activeTimer);
    activeTimer = null;
  }
  setSchedulerState(false, currentMode);
  console.log('[Scheduler] Stopped scheduler.');
}

export function getSchedulerStatus(): { active: boolean; mode: string } {
  return {
    active: activeTimer !== null || currentMode === 'MANUAL',
    mode: currentMode
  };
}
