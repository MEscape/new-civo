import type { AppResultAsync } from '@lib/result';

import type { AuthenticatorError } from '../../domain/ports/authenticator.port';
import type { AuthenticationDependencies } from '../auth-dependencies';

/** Ends the current session. Idempotent: signing out while signed out succeeds. */
export class SignOut {
    constructor(private readonly deps: AuthenticationDependencies) {}

    execute(): AppResultAsync<void, AuthenticatorError> {
        return this.deps.authenticator.signOut();
    }
}
