import { invalid, ruleTester, rules, valid } from './rule-tester';

const REPO = 'src/modules/shop/infrastructure/prisma/prisma-shop.repository.ts';
const MAPPER = 'src/modules/shop/infrastructure/prisma/shop-record-mapper.ts';
const AUDIT = 'src/modules/shop/infrastructure/audit/logger-shop-audit-log.ts';

const GOOD_REPO = `
import { createPersistenceFailures, db } from '@lib/db';
import { fromThrowableAsync } from '@lib/result';
const failures = createPersistenceFailures({ module: 'shop.persistence', code: 'shop.failed', subject: 'Shop' });
function query() { return db.orm.public.Shop.select('id'); }
export class PrismaShopRepository {
  findById(id: ShopId, tenantId: TenantId) {
    return fromThrowableAsync(() => query().where({ id, tenantId }).first(), failures.infraOnly('findById')).map(toShop);
  }
  create(input: NewShop) {
    return fromThrowableAsync(
      () => db.transaction(async (tx) => tx.orm.public.Shop.create(input)),
      failures.orConflict('create', shopSlugTaken)
    ).map(toShop);
  }
  update(id: ShopId) {
    return fromThrowableAsync(() => db.orm.public.Shop.where({ id }).update({}), failures.orNotFound('update', shopNotFound));
  }
}`;

ruleTester.run('architecture/persistence-failures', rules['persistence-failures']!, {
  valid: [
    valid(REPO, GOOD_REPO),
    valid(MAPPER, "import type { ShopRecord } from './types';\nexport function toShop(record: ShopRecord) { return record; }"),
    valid('src/modules/shop/application/x.ts', "import { mapPrismaError } from '@lib/db';"), // layer rules, not this rule, police other layers
  ],
  invalid: [
    invalid(REPO, GOOD_REPO.replace("const failures = createPersistenceFailures({ module: 'shop.persistence', code: 'shop.failed', subject: 'Shop' });", ''), /must create its failure mapper/),
    invalid(REPO, GOOD_REPO.replace("failures.infraOnly('findById')", '(e) => toInfra(e)'), /Pass `failures\.infraOnly/),
    invalid(
      REPO,
      GOOD_REPO.replace('findById(id: ShopId, tenantId: TenantId) {', 'findById(id: ShopId, tenantId: TenantId) { return db.orm.public.Shop.first({ id });'),
      /Database calls must run inside `fromThrowableAsync/
    ),
    invalid(REPO, GOOD_REPO.replace("failures.orConflict('create', shopSlugTaken)", "failures.infraOnly('findById')"), /already used in this repository/),
    invalid(REPO, GOOD_REPO.replace("failures.infraOnly('findById')", 'failures.infraOnly(name)'), /Operation names are stable string literals/),
    invalid(REPO, GOOD_REPO.replace("failures.orConflict('create', shopSlugTaken)", "failures.orConflict('create')"), /takes the domain error factory as its second argument/),
    invalid(REPO, `import { mapPrismaError } from '@lib/db';\n${GOOD_REPO}`, /Do not map Prisma errors locally/),
    invalid(REPO, `import { ok } from 'neverthrow';\n${GOOD_REPO}`, /Import result helpers from '@lib\/result'/),
    invalid(REPO, `${GOOD_REPO}\nconst isUnique = (e) => e.code === 'P2002';`, /Do not branch on Prisma\/ORM error code 'P2002'/),
    invalid(REPO, `${GOOD_REPO}\nconst isMissing = (e) => e.code === 'ORM.MUTATION_ROW_MISSING';`, /Do not branch on Prisma\/ORM error code/),
    invalid(MAPPER, "import { db } from '@lib/db';\nexport function toShop() { return db; }", /Record mappers are pure conversions/),
  ],
});

const GOOD_AUDIT = `
import { logger } from '@lib/logger';
import type { ShopAuditLog, ShopEvent } from '../../domain/ports/shop-audit-log.port';
const auditLogger = logger.withContext({ module: 'shop.audit' });
const LEVEL_BY_EVENT = { 'shop.created': 'info', 'shop.failed': 'warn' } as const satisfies Record<ShopEvent['type'], 'info' | 'warn'>;
export class LoggerShopAuditLog implements ShopAuditLog {
  record(event: ShopEvent): void {
    const { type, ...details } = event;
    try {
      auditLogger[LEVEL_BY_EVENT[type]](type, details);
    } catch {
      // never fail the request
    }
  }
}`;

ruleTester.run('architecture/audit-adapter', rules['audit-adapter']!, {
  valid: [
    valid(AUDIT, GOOD_AUDIT),
    valid('src/modules/shop/infrastructure/logging/logger-shop-audit-log.ts', GOOD_AUDIT), // established alias of audit/
    valid('src/modules/shop/infrastructure/prisma/prisma-shop.repository.ts', 'export class NotAnAdapter {}'),
  ],
  invalid: [
    invalid(AUDIT, GOOD_AUDIT.replace("logger.withContext({ module: 'shop.audit' })", 'logger'), /Create a module-scoped logger/),
    invalid(AUDIT, GOOD_AUDIT.replace(" as const satisfies Record<ShopEvent['type'], 'info' | 'warn'>", ' as const'), /exhaustive|event→level map/i),
    invalid(AUDIT, GOOD_AUDIT.replace("satisfies Record<ShopEvent['type'], 'info' | 'warn'>", "satisfies Record<ShopEvent['type'], string>"), /event→level map/),
    invalid(AUDIT, `${GOOD_AUDIT}\nexport class Other {}`, /exactly one class \(found 2\)/),
    invalid(AUDIT, GOOD_AUDIT.replace(' implements ShopAuditLog', ''), /must `implements <Module>AuditLog`/),
    invalid(
      AUDIT,
      GOOD_AUDIT.replace(/ {4}try \{[\s\S]*?\n {4}\}\n {2}\}/, '    auditLogger[LEVEL_BY_EVENT[type]](type, details);\n  }'),
      /Wrap the logging call in try\/catch/
    ),
    invalid(AUDIT, GOOD_AUDIT.replace('// never fail the request', 'throw new Error("x");'), /must swallow the logging failure/),
    invalid(AUDIT, GOOD_AUDIT.replace('auditLogger[LEVEL_BY_EVENT[type]](type, details);', 'auditLogger.info(type, details);'), /Select the log level through `LEVEL_BY_EVENT\[event\.type\]`/),
  ],
});
