/**
 * Browser-safe public API: Server Actions and types only, nothing that
 * reaches server-only code. Client Components import from here instead
 * of the main `index.ts`, which reaches server-only infrastructure via
 * `composition.ts`.
 */
export { createDataSourceAction } from './presentation/actions/create-data-source-action';
export { createDatasetAction } from './presentation/actions/create-dataset-action';
export { deleteDataSourceAction } from './presentation/actions/delete-data-source-action';
export { deleteDatasetAction } from './presentation/actions/delete-dataset-action';
export { discoverDatasetAction } from './presentation/actions/discover-dataset-action';
export { listCompatibleDatasetsAction } from './presentation/actions/list-compatible-datasets-action';
export { previewDatasetMappingAction } from './presentation/actions/preview-dataset-mapping-action';
export { saveDatasetMappingAction } from './presentation/actions/save-dataset-mapping-action';
export { testDataSourceConnectionAction } from './presentation/actions/test-data-source-connection-action';
export { updateDatasetAction } from './presentation/actions/update-dataset-action';

export type { DatasetDto } from './presentation/dto/dataset-dto';
export type { DataSourceDto } from './presentation/dto/data-source-dto';
export { toDataSourceDto } from './presentation/dto/data-source-dto';
export { toDatasetDto } from './presentation/dto/dataset-dto';
export type { CanonicalKind } from './application/contracts/data-source-views';
export { dataSourceRoutes } from './presentation/routes';
