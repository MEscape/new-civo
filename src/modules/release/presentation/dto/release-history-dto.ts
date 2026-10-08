import { toMigrationSummaryDto } from './migration-dto';

import type { MigrationSummaryDto } from './migration-dto';
import type { MigrationSummaryView } from '../../application/contracts/release-views';

/**
 * What a Server Component hands to the migration history panel.
 *
 * The history contract deliberately contains summaries rather than complete
 * migration details. The history list needs to show when a migration was
 * proposed/applied and its status, but it does not need the migration plan.
 */
export interface MigrationHistoryDto {
  readonly migrations: readonly MigrationSummaryDto[];
}

/**
 * Converts the application-layer migration history into the transport
 * contract consumed by the migration history UI.
 *
 * The application currently supplies the history as summary views, so the
 * mapper only needs to convert each summary's Date values to ISO strings.
 */
export function toMigrationHistoryDto(
  views: readonly MigrationSummaryView[]
): MigrationHistoryDto {
  return {
    migrations: views.map(toMigrationSummaryDto),
  };
}
