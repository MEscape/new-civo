/**
 * Browser-safe public API: Server Actions, routes and types only, nothing
 * that reaches server-only code. Client Components of OTHER modules import
 * from here instead of the main `index.ts`, which reaches server-only
 * infrastructure via `composition.ts`.
 */
export { requestPasswordResetAction } from './presentation/actions/request-password-reset-action';
export { resetPasswordAction } from './presentation/actions/reset-password-action';
export { signInAction } from './presentation/actions/sign-in-action';
export { signOutAction } from './presentation/actions/sign-out-action';
export { signUpAction } from './presentation/actions/sign-up-action';

export type { SignInDto } from './presentation/dto/auth-dto';
export { authRoutes } from './presentation/routes';
