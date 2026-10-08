/**
 * Server-side public API of the component-platform module: the catalog of
 * components, the page renderer, and the facts a release pins. Other modules
 * and framework entry points import from here and nowhere deeper. Browser
 * code imports from `./client`.
 */
export { componentPlatformQueries, renderPageNodes } from './composition';

export {
  COMPONENT_PLATFORM_ERROR_CODES,
  CONTENT_KINDS,
} from './application/contracts/component-platform-constraints';

export { default as enComponentPlatform } from './presentation/i18n/en.json';
export { default as deComponentPlatform } from './presentation/i18n/de.json';

export type {
  CatalogBoundsView,
  CatalogContractView,
  CatalogFieldView,
  CatalogOptionView,
  ComponentCatalogEntry,
  ComponentCatalogView,
  ComponentReleaseInfo,
  ReleaseContractView,
} from './application/contracts/catalog-views';
export type {
  ContentKind,
  RenderContext,
  RenderMode,
  RenderableNode,
} from './application/contracts/component-platform-constraints';
