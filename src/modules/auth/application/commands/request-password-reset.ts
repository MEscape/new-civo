import type { AppResultAsync } from '@lib/result';

import { createPasswordResetRequest } from '../../domain/models/credentials';
import { enforceRateLimit } from '../enforce-rate-limit';

import type { AuthenticatorError } from '../../domain/ports/authenticator.port';
import type { AuthenticationDependencies } from '../auth-dependencies';
import type { PasswordResetRequestInput } from '../contracts/auth-inputs';
import type { RateLimitError } from '../enforce-rate-limit';

export type RequestPasswordResetError = AuthenticatorError | RateLimitError;

/**
 * Sends a reset link if the address has an account. Succeeds either way, so
 * it cannot be used to find out which addresses are registered.
 */
export class RequestPasswordReset {
    constructor(private readonly deps: AuthenticationDependencies) {}

    execute(
        input: PasswordResetRequestInput
    ): AppResultAsync<void, RequestPasswordResetError> {
        return createPasswordResetRequest(input).asyncAndThen((request) =>
            enforceRateLimit(this.deps, 'password_reset', request.email).andThen(
                () => this.deps.authenticator.requestPasswordReset(request)
            )
        );
    }
}
