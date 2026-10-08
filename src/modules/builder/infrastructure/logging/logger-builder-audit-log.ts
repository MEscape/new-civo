import { logger } from '@lib/logger';

import type {
  BuilderAuditLog,
  BuilderEvent,
} from '../../domain/ports/builder-audit-log.port';

const auditLogger = logger.withContext({ module: 'builder.audit' });

/**
 * Scope violations are `warn` so alerting can key on them: a municipal
 * editor submitting structure changes is either a bug or an attack.
 * Exhaustive per event type.
 */
const LEVEL_BY_EVENT = {
  'page.created': 'info',
  'page.system_created': 'info',
  'page.config_saved': 'info',
  'page.edit_scope_violation': 'warn',
} as const satisfies Record<BuilderEvent['type'], 'info' | 'warn'>;

export class LoggerBuilderAuditLog implements BuilderAuditLog {
  record(event: BuilderEvent): void {
    const { type, ...details } = event;
    try {
      auditLogger[LEVEL_BY_EVENT[type]](type, details);
    } catch {
      // Auditing must never fail the request it describes.
    }
  }
}
