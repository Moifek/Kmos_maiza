import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const API_KEY_HEADER_NAME = 'x-api-key';

@Injectable()
export class ApiKeyAuthGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    if (context.getType<'http'>() !== 'http') {
      return true;
    }
    const request = context.switchToHttp().getRequest<{ headers: Record<string, string | string[] | undefined> }>();
    const apiKeyHeaderValue = request.headers[API_KEY_HEADER_NAME];
    const apiKey = this.extractApiKey(apiKeyHeaderValue);
    if (!apiKey) {
      throw new UnauthorizedException('Missing API key');
    }
    const validKeys = this.getValidApiKeys();
    if (!validKeys.includes(apiKey)) {
      throw new UnauthorizedException('Invalid API key');
    }
    return true;
  }

  private extractApiKey(apiKeyHeaderValue: string | string[] | undefined): string | null {
    if (!apiKeyHeaderValue) {
      return null;
    }
    if (Array.isArray(apiKeyHeaderValue)) {
      return apiKeyHeaderValue[0] ?? null;
    }
    return apiKeyHeaderValue;
  }

  private getValidApiKeys(): readonly string[] {
    const configuredApiKeys = this.configService.get<string>('API_KEYS', '');
    const configuredPosApiKeys = this.configService.get<string>('POS_API_KEYS', '');
    const configuredThirdPartyApiKeys = this.configService.get<string>('THIRD_PARTY_API_KEYS', '');
    return [...configuredApiKeys, ...configuredPosApiKeys, ...configuredThirdPartyApiKeys]
      .join(',')
      .split(',')
      .map((value) => value.trim())
      .filter((value) => value.length > 0);
  }
}
