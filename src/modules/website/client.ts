/**
 * Browser-safe public API: Server Actions and types only, nothing that
 * reaches server-only code. Client Components import from here instead
 * of the main `index.ts`, which reaches server-only infrastructure via
 * `composition.ts`.
 */
export { createWebsiteAction } from './presentation/actions/create-website-action';
export { updateWebsiteAction } from './presentation/actions/update-website-action';
export { updateWebsiteThemeAction } from './presentation/actions/update-website-theme-action';

export type { WebsiteDto } from './presentation/dto/website-dto';
export { toWebsiteDto } from './presentation/dto/website-dto';
export { websiteRoutes } from './presentation/routes';
