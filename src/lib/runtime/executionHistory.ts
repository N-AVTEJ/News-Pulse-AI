import { PipelineRun } from './types';

class InternalExecutionHistory {
  private history: PipelineRun[] = [];
  private maxHistorySize = 100;

  logRun(run: PipelineRun): void {
    this.history.unshift(run);
    if (this.history.length > this.maxHistorySize) {
      this.history = this.history.slice(0, this.maxHistorySize);
    }
  }

  getHistory(limit: number = 20, searchQuery?: string): PipelineRun[] {
    let result = this.history;

    if (searchQuery && searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (run) =>
          run.runId.toLowerCase().includes(q) ||
          run.trigger.toLowerCase().includes(q) ||
          run.status.toLowerCase().includes(q)
      );
    }

    return result.slice(0, limit);
  }

  clearHistory(): void {
    this.history = [];
  }
}

export const executionHistory = new InternalExecutionHistory();
