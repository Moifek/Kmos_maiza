import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/** Marks a route as publicly accessible, bypassing the JWT auth guard. */
export const PublicRoute = () => SetMetadata(IS_PUBLIC_KEY, true);
