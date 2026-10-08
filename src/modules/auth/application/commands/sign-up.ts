import type { AppResultAsync } from '@lib/result';

import { createSignUpDraft } from '../../domain/models/credentials';
import { enforceRateLimit } from '../enforce-rate-limit';

import type { AuthenticatorError } from '../../domain/ports/authenticator.port';
import type { AuthenticationDependencies } from '../auth-dependencies';
import type { SignUpInput } from '../contracts/auth-inputs';
import type { RateLimitError } from '../enforce-rate-limit';

export type SignUpError = AuthenticatorError | RateLimitError;

/**
 * Requests a new account. The outcome is identical whether or not the
 * address is already registered (the real owner is told by email instead),
 * so the caller can only say "check your inbox". The new account has no
 * membership, and therefore no permissions, until one is granted.
 */
export class SignUp {
    constructor(private readonly deps: AuthenticationDependencies) {}

    execute(input: SignUpInput): AppResultAsync<void, SignUpError> {
        return createSignUpDraft(input).asyncAndThen((draft) =>
            enforceRateLimit(this.deps, 'sign_up', draft.email).andThen(() =>
                this.deps.authenticator.signUp(draft)
            )
        );
    }
}
