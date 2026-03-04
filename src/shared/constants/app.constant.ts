export const APP_NAME = 'KOMS' as const;
export const API_PREFIX = 'api/v1' as const;
export const DEFAULT_PORT = 3000 as const;

export const REDIS_KEY_PREFIX = 'koms:' as const;
export const CACHE_KEY_PREFIX = 'koms:cache:' as const;
export const EVENT_CHANNEL_PREFIX = 'koms:events:' as const;

export const PAGINATION_DEFAULT_LIMIT = 20 as const;
export const PAGINATION_MAX_LIMIT = 100 as const;

export const THROTTLE_DEFAULT_NAME = 'default' as const;
export const THROTTLE_AUTH_NAME = 'auth' as const;
export const THROTTLE_DEFAULT_TTL_MS = 60_000 as const;
export const THROTTLE_DEFAULT_LIMIT = 60 as const;
export const THROTTLE_AUTH_TTL_MS = 60_000 as const;
export const THROTTLE_AUTH_LIMIT = 5 as const;
