/**
 * Server-side public API of the data-sources module. Other modules and
 * framework entry points import from here and nowhere deeper. Components
 * that run in the browser import from `./client` instead: this file reaches
 * server-only code and must never end up in a client bundle.
 */

export { dataSourceQueries } from "./composition";

export { DataSourcesSettings } from "./presentation/components/data-sources-settings";
export { DataSourceForm } from "./presentation/components/data-source-form";
export { DatasetForm } from "./presentation/components/dataset-form";
export { DataSourcesPanel } from "./presentation/components/data-sources-panel";
export { DatasetManagementPanel } from "./presentation/components/dataset-management-panel";

export {
  dataSourceCacheTag,
  datasetCacheTag,
} from "./application/contracts/cache-tags";

export type {
  CanonicalKind,
  DataSourceKind,
  MappedRecordView,
  MappedRecordsView,
} from "./application/contracts/data-source-views";

export * from "./domain/models/ids";
export { DATA_SOURCE_ERROR_CODES } from "./domain/errors/data-source-errors";

export { default as enDataSource } from "./presentation/i18n/en.json";
export { default as deDataSource } from "./presentation/i18n/de.json";
