import 'server-only';

import { redirect } from 'next/navigation';

import { getAuthQueries } from '../../composition';
import { authRoutes } from '../routes';

import type { ActorView } from '../../application/contracts/auth-views';

/**
 * Page-level guard for Server Components and layouts: returns the signed-in
 * actor or redirects to sign-in. This is navigation convenience, NOT
 * authorization. Every use case behind the page still calls
 * `AuthorizationService` itself, so removing or bypassing this guard never
 * exposes data.
 *
 * Only "not signed in" redirects. An infrastructure failure is unexpected
 * and must reach `error.tsx` instead of bouncing the user to sign-in.
 */
export async function requireSignedIn(returnTo?: string): Promise<ActorView> {
    const result = await getAuthQueries().getCurrentActor.execute();

    if (result.isOk()) {return result.value;}
    if (result.error.kind === 'unauthorized') {redirect(authRoutes.signIn(returnTo));}
    throw new Error(result.error.code, { cause: result.error });
}
