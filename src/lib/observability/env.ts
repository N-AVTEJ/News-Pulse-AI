export interface AppEnvConfig {
  nodeEnv: 'development' | 'test' | 'staging' | 'production';
  port: number;
  appUrl: string;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  rateLimitPerMinute: number;
  webhookSecret: string;
  schedulerIntervalMinutes: number;
  memoryThresholdMb: number;
  isProduction: boolean;
}

export function validateEnv(): AppEnvConfig {
  const nodeEnv = (process.env.NODE_ENV as AppEnvConfig['nodeEnv']) || 'development';
  const port = parseInt(process.env.PORT || '3000', 10);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || `http://localhost:${port}`;
  const logLevel = (process.env.LOG_LEVEL as AppEnvConfig['logLevel']) || 'info';
  const rateLimitPerMinute = parseInt(process.env.API_RATE_LIMIT_PER_MINUTE || '60', 10);
  const webhookSecret = process.env.WEBHOOK_SIGNING_SECRET || 'np_wh_sec_dev_fallback';
  const schedulerIntervalMinutes = parseInt(process.env.SCHEDULER_INTERVAL_MINUTES || '5', 10);
  const memoryThresholdMb = parseInt(process.env.HEALTH_MEMORY_THRESHOLD_MB || '1024', 10);

  return {
    nodeEnv,
    port,
    appUrl,
    logLevel,
    rateLimitPerMinute,
    webhookSecret,
    schedulerIntervalMinutes,
    memoryThresholdMb,
    isProduction: nodeEnv === 'production'
  };
}

export const envConfig = validateEnv();
