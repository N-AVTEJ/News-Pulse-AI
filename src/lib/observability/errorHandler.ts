import { NextResponse } from 'next/server';
import { logger } from './logger';

export interface ApiErrorResponse {
  code: string;
  message: string;
  requestId: string;
  timestamp: string;
  details?: string;
}

export function createErrorResponse(
  status: number,
  code: string,
  message: string,
  requestId: string,
  details?: string
): NextResponse {
  logger.error(`API Error [${code}]: ${message}`, {
    requestId,
    status: `${status}`,
    error: details || message
  });

  const body: ApiErrorResponse = {
    code,
    message,
    requestId,
    timestamp: new Date().toISOString(),
    details: process.env.NODE_ENV === 'production' ? undefined : details
  };

  return NextResponse.json(body, { status });
}
