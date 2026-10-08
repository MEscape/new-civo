import 'server-only';

import { dataSourceQueries } from '@modules/data-sources';

import { systemClock } from '@lib/clock';

import { CanNestComponent } from './application/queries/can-nest-component';
import { GetComponentDefaultProps } from './application/queries/get-component-default-props';
import { GetComponentReleaseInfo } from './application/queries/get-component-release-info';
import { ListComponentCatalog } from './application/queries/list-component-catalog';
import { ListContent } from './application/queries/list-content';
import { COMPONENT_REGISTRY } from './domain/components/platform-registry';
import { DatasetContentSource } from './infrastructure/data-sources/dataset-content-source';
import { createPageRenderer } from './presentation/components/page-renderer/create-page-renderer';
import { createContentLoader } from './presentation/components/page-renderer/load-content';

import type { PublicComponentPlatformDependencies } from './application/component-platform-dependencies';

/**
 * The module's composition root: the one file that knows both the use cases
 * and their adapters, and the only one that reaches another module. The
 * data-sources use case is passed as a function, so the adapter depends on
 * what it needs and not on how data-sources is built.
 */
const deps: PublicComponentPlatformDependencies = {
  registry: COMPONENT_REGISTRY,
  live: new DatasetContentSource((datasetId, websiteId) =>
    dataSourceQueries.getMappedDatasetRecords.execute(datasetId, websiteId)
  ),
  clock: systemClock,
};

export const componentPlatformQueries = {
  listContent: new ListContent(deps),
  listComponentCatalog: new ListComponentCatalog(deps),
  canNestComponent: new CanNestComponent(deps),
  getComponentReleaseInfo: new GetComponentReleaseInfo(deps),
  getComponentDefaultProps: new GetComponentDefaultProps(deps),
} as const;

/**
 * The page renderer, wired with the one thing data components need: a loader
 * built from `listContent`. Presentation never reaches this file; the
 * dependency is handed in from here.
 */
export const renderPageNodes = createPageRenderer({
  loadContent: createContentLoader(componentPlatformQueries.listContent),
});
