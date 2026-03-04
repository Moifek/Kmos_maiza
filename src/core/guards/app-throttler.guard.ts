import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

const API_KEY_HEADER = 'x-api-key' as const;

/**
 * Extends ThrottlerGuard to key rate-limit buckets by API key when present.
 * Falls back to client IP for JWT-authenticated and anonymous routes.
 *
 * This prevents POS terminals and third-party integrations behind shared NAT
 * from colliding into a single IP-based bucket.
 */
@Injectable()
export class AppThrottlerGuard extends ThrottlerGuard {
  protected async getTracker(req: Record<string, unknown>): Promise<string> {
    const headers = req['headers'] as Record<string, string | string[] | undefined> | undefined;
    const apiKeyHeader = headers?.[API_KEY_HEADER];
    if (apiKeyHeader) {
      return Array.isArray(apiKeyHeader) ? (apiKeyHeader[0] ?? this.resolveIp(req)) : apiKeyHeader;
    }
    return this.resolveIp(req);
  }

  private resolveIp(req: Record<string, unknown>): string {
    return String(req['ip'] ?? 'unknown');
  }
}
