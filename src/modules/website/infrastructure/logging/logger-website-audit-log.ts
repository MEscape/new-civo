import { logger } from '@lib/logger';

import type {
  WebsiteAuditLog,
  WebsiteEvent,
} from '../../domain/ports/website-audit-log.port';

const auditLogger = logger.withContext({ module: 'website.audit' });

/** Failures are `warn` so alerting can key on them. Exhaustive per event type. */
const LEVEL_BY_EVENT = {
  'website.created': 'info',
  'website.updated': 'info',
  'website.theme_updated': 'info',
  'website.provisioning_rollback_failed': 'warn',
} as const satisfies Record<WebsiteEvent['type'], 'info' | 'warn'>;

export class LoggerWebsiteAuditLog implements WebsiteAuditLog {
  record(event: WebsiteEvent): void {
    const { type, ...details } = event;
    try {
      auditLogger[LEVEL_BY_EVENT[type]](type, details);
    } catch {
      // Auditing must never fail the request it describes.
    }
  }
}
