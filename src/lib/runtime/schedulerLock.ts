export interface SchedulerExecutionLock {
  isLocked: boolean;
  activeRunId?: string;
  lockedAt?: string;
  lastSuccessfulRun?: string;
  lastFailedRun?: string;
  consecutiveFailures: number;
}

class SchedulerLockManager {
  private lockState: SchedulerExecutionLock = {
    isLocked: false,
    consecutiveFailures: 0
  };

  acquireLock(runId: string, timeoutMs: number = 300000): { acquired: boolean; currentLock: SchedulerExecutionLock } {
    // If lock is held but has timed out (> 5 min), auto-release
    if (this.lockState.isLocked && this.lockState.lockedAt) {
      const lockAge = Date.now() - new Date(this.lockState.lockedAt).getTime();
      if (lockAge > timeoutMs) {
        this.releaseLock(this.lockState.activeRunId || 'timeout', false);
      }
    }

    if (this.lockState.isLocked) {
      return { acquired: false, currentLock: { ...this.lockState } };
    }

    this.lockState.isLocked = true;
    this.lockState.activeRunId = runId;
    this.lockState.lockedAt = new Date().toISOString();

    return { acquired: true, currentLock: { ...this.lockState } };
  }

  releaseLock(runId: string, success: boolean): SchedulerExecutionLock {
    if (this.lockState.activeRunId === runId || this.lockState.isLocked) {
      this.lockState.isLocked = false;
      this.lockState.activeRunId = undefined;
      this.lockState.lockedAt = undefined;

      if (success) {
        this.lockState.lastSuccessfulRun = new Date().toISOString();
        this.lockState.consecutiveFailures = 0;
      } else {
        this.lockState.lastFailedRun = new Date().toISOString();
        this.lockState.consecutiveFailures++;
      }
    }

    return { ...this.lockState };
  }

  getLockState(): SchedulerExecutionLock {
    return { ...this.lockState };
  }
}

export const schedulerLock = new SchedulerLockManager();
