import { notFound, redirect } from 'next/navigation';

import { logger } from '@lib/logger';

import { matchAppError } from './factory';

import type { AppError } from './app-error';

/**
 * Not found, forbidden and invalid ids all look the same on purpose: the
 * route must not disclose whether a resource exists in another tenant.
 */
export function failRoute(error: AppError, signInPath: string): never {
    return matchAppError(error, {
        validation: () => notFound(),
        not_found: () => notFound(),
        forbidden: () => notFound(),
        conflict: () => notFound(),
        unauthorized: () => redirect(signInPath),
        infrastructure: (cause) => escalate(cause),
        unexpected: (cause) => escalate(cause),
    });
}

/** Logged once, here, then handed to the nearest `error.tsx` boundary. */
export function escalate(error: AppError): never {
    logger.error('route.failed', error, { code: error.code });
    throw new Error(error.code, { cause: error });
}
