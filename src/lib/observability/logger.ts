export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface StructuredLogEntry {
  timestamp: string;
  level: LogLevel;
  service: string;
  requestId?: string;
  runId?: string;
  jobId?: string;
  userId?: string;
  workspaceId?: string;
  event: string;
  durationMs?: number;
  status?: string;
  error?: string;
  metadata?: Record<string, unknown>;
}

// Redaction patterns for sensitive tokens, passwords, and authorization headers
const SENSITIVE_KEYS = ['password', 'secret', 'token', 'authorization', 'apikey', 'key', 'credential'];

function sanitizeMetadata(data?: Record<string, unknown>): Record<string, unknown> | undefined {
  if (!data) return undefined;
  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(data)) {
    const isSensitive = SENSITIVE_KEYS.some(k => key.toLowerCase().includes(k));
    if (isSensitive && typeof value === 'string') {
      sanitized[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeMetadata(value as Record<string, unknown>);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

class StructuredLogger {
  private serviceName: string;

  constructor(serviceName: string = 'newspulse-core') {
    this.serviceName = serviceName;
  }

  private log(level: LogLevel, event: string, options: Partial<StructuredLogEntry> = {}): StructuredLogEntry {
    const entry: StructuredLogEntry = {
      timestamp: new Date().toISOString(),
      level,
      service: this.serviceName,
      event,
      ...options,
      metadata: sanitizeMetadata(options.metadata)
    };

    const formatted = JSON.stringify(entry);

    if (level === 'error') {
      console.error(formatted);
    } else if (level === 'warn') {
      console.warn(formatted);
    } else {
      console.log(formatted);
    }

    return entry;
  }

  debug(event: string, options?: Partial<StructuredLogEntry>): StructuredLogEntry {
    return this.log('debug', event, options);
  }

  info(event: string, options?: Partial<StructuredLogEntry>): StructuredLogEntry {
    return this.log('info', event, options);
  }

  warn(event: string, options?: Partial<StructuredLogEntry>): StructuredLogEntry {
    return this.log('warn', event, options);
  }

  error(event: string, options?: Partial<StructuredLogEntry>): StructuredLogEntry {
    return this.log('error', event, options);
  }
}

export const logger = new StructuredLogger();
export function createLogger(serviceName: string): StructuredLogger {
  return new StructuredLogger(serviceName);
}
