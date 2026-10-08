import { logger } from '@lib/logger';

import type {
  ReleaseAuditLog,
  ReleaseEvent,
} from '../../domain/ports/release-audit-log.port';

const auditLogger = logger.withContext({ module: 'release.audit' });

/** A blocked publish and an incomplete migration are `warn` so alerting can key on them. Exhaustive per event type. */
const LEVEL_BY_EVENT = {
  'release.published': 'info',
  'release.rolled_back': 'info',
  'release.publish_blocked': 'warn',
  'release.migration_proposed': 'info',
  'release.migration_applied': 'info',
  'release.migration_apply_incomplete': 'warn',
} as const satisfies Record<ReleaseEvent['type'], 'info' | 'warn'>;

export class LoggerReleaseAuditLog implements ReleaseAuditLog {
  record(event: ReleaseEvent): void {
    const { type, ...details } = event;
    try {
      auditLogger[LEVEL_BY_EVENT[type]](type, details);
    } catch {
      // Auditing must never fail the request it describes.
    }
  }
}
