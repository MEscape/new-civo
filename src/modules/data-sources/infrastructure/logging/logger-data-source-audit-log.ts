import { logger } from '@lib/logger';

import type {
    DataSourceAuditLog,
    DataSourceEvent,
} from '../../domain/ports/data-source-audit-log.port';

const auditLogger = logger.withContext({ module: 'data-source.audit' });

/**
 * A failed connection test is a recorded outcome, not a system failure, so
 * every event is `info`. Exhaustive per event type.
 */
const LEVEL_BY_EVENT = {
    'data_source.created': 'info',
    'data_source.tested': 'info',
    'data_source.deleted': 'info',
    'dataset.created': 'info',
    'dataset.updated': 'info',
    'dataset.mapping_saved': 'info',
    'dataset.deleted': 'info',
} as const satisfies Record<DataSourceEvent['type'], 'info' | 'warn'>;

export class LoggerDataSourceAuditLog implements DataSourceAuditLog {
    record(event: DataSourceEvent): void {
        const { type, ...details } = event;
        try {
            auditLogger[LEVEL_BY_EVENT[type]](type, details);
        } catch {
            // Auditing must never fail the request it describes.
        }
    }
}
