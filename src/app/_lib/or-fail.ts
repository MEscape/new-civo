import { authRoutes } from '@modules/auth';

import { failRoute } from '@lib/errors';
import type { AppError } from '@lib/errors';
import type { AppResult } from '@lib/result';

/**
 * The value of a use-case result, or the route's failure: not found for
 * anything the actor must not learn about, sign-in when the session is gone,
 * the error boundary for the rest (see `failRoute`). Pages call this instead
 * of each choosing their own error handling.
 */
export function orFail<T, E extends AppError>(result: AppResult<T, E>): T {
    return result.match(
        (value) => value,
        (error) => failRoute(error, authRoutes.signIn())
    );
}
