/**
 * Browser-safe public API: Server Actions, routes and types only, nothing
 * that reaches server-only code. Client Components of OTHER modules import
 * from here instead of the main `index.ts`, which reaches server-only
 * infrastructure via `composition.ts`.
 */
export { createPageAction } from './presentation/actions/create-page-action';
export { builderRoutes } from './presentation/routes';

export type { PageSummaryDto } from './presentation/dto/page-dto';
