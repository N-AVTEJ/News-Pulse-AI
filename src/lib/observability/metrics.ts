export interface ApplicationMetrics {
  totalRequests: number;
  totalErrors: number;
  storiesIngested: number;
  clustersCreated: number;
  verificationJobs: number;
  analysisReportsGenerated: number;
  queueDepth: number;
  failedJobs: number;
  notificationsDelivered: number;
  apiUsageByRoute: Record<string, number>;
  averageResponseLatencyMs: number;
  lastUpdated: string;
}

class MetricsRegistry {
  private metrics: ApplicationMetrics = {
    totalRequests: 0,
    totalErrors: 0,
    storiesIngested: 0,
    clustersCreated: 0,
    verificationJobs: 0,
    analysisReportsGenerated: 0,
    queueDepth: 0,
    failedJobs: 0,
    notificationsDelivered: 0,
    apiUsageByRoute: {},
    averageResponseLatencyMs: 45,
    lastUpdated: new Date().toISOString()
  };

  private latencies: number[] = [];

  incrementRequest(route?: string): void {
    this.metrics.totalRequests++;
    if (route) {
      this.metrics.apiUsageByRoute[route] = (this.metrics.apiUsageByRoute[route] || 0) + 1;
    }
    this.metrics.lastUpdated = new Date().toISOString();
  }

  incrementError(): void {
    this.metrics.totalErrors++;
    this.metrics.lastUpdated = new Date().toISOString();
  }

  recordStoriesIngested(count: number): void {
    this.metrics.storiesIngested += count;
    this.metrics.lastUpdated = new Date().toISOString();
  }

  recordClustersCreated(count: number): void {
    this.metrics.clustersCreated += count;
    this.metrics.lastUpdated = new Date().toISOString();
  }

  recordVerificationJob(): void {
    this.metrics.verificationJobs++;
    this.metrics.lastUpdated = new Date().toISOString();
  }

  recordAnalysisJob(): void {
    this.metrics.analysisReportsGenerated++;
    this.metrics.lastUpdated = new Date().toISOString();
  }

  recordNotificationDelivered(): void {
    this.metrics.notificationsDelivered++;
    this.metrics.lastUpdated = new Date().toISOString();
  }

  recordQueueStatus(depth: number, failedCount: number): void {
    this.metrics.queueDepth = depth;
    this.metrics.failedJobs = failedCount;
    this.metrics.lastUpdated = new Date().toISOString();
  }

  observeLatency(durationMs: number): void {
    this.latencies.push(durationMs);
    if (this.latencies.length > 50) this.latencies.shift();
    const sum = this.latencies.reduce((a, b) => a + b, 0);
    this.metrics.averageResponseLatencyMs = Math.round(sum / this.latencies.length);
    this.metrics.lastUpdated = new Date().toISOString();
  }

  getSnapshot(): ApplicationMetrics {
    return { ...this.metrics };
  }

  reset(): void {
    this.metrics = {
      totalRequests: 0,
      totalErrors: 0,
      storiesIngested: 0,
      clustersCreated: 0,
      verificationJobs: 0,
      analysisReportsGenerated: 0,
      queueDepth: 0,
      failedJobs: 0,
      notificationsDelivered: 0,
      apiUsageByRoute: {},
      averageResponseLatencyMs: 0,
      lastUpdated: new Date().toISOString()
    };
    this.latencies = [];
  }
}

export const metricsRegistry = new MetricsRegistry();
