/**
 * Browser-safe public API: Server Actions and types only, nothing that
 * reaches server-only code. Client Components import from here instead
 * of the main `index.ts`, which reaches server-only infrastructure via
 * `composition.ts`.
 */
export { publishReleaseAction } from './presentation/actions/publish-release-action';
export { rollbackReleaseAction } from './presentation/actions/rollback-release-action';
export { applyMigrationAction } from './presentation/actions/apply-migration-action';
export { proposeMigrationAction } from './presentation/actions/propose-migration-action';

export { toMigrationHistoryDto } from './presentation/dto/migration-history-dto';
export { toReleaseHistoryDto } from './presentation/dto/release-history-dto';

export type { ReleaseHistoryDto } from './presentation/dto/release-history-dto';
export type { ReleaseSummaryDto } from './presentation/dto/release-dto';
export type {
  MigrationDetailDto,
  MigrationSummaryDto,
} from './presentation/dto/migration-dto';
export type { MigrationHistoryDto } from './presentation/dto/migration-history-dto';

export { releaseRoutes } from './presentation/routes';
