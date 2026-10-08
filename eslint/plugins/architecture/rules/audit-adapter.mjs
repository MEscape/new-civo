import { classifyContext, defineRule, report } from '../util.mjs';

const LEVELS = new Set(['info', 'warn']);

function unwrap(node) {
  let current = node;
  while (current && (current.type === 'TSAsExpression' || current.type === 'TSSatisfiesExpression')) current = current.expression;
  return current;
}

function isLevelRecord(typeNode) {
  if (!(typeNode?.type === 'TSTypeReference' && typeNode.typeName.name === 'Record')) return false;
  const value = typeNode.typeArguments?.params[1];
  return value?.type === 'TSUnionType' && value.types.length === 2 && value.types.every((t) => t.type === 'TSLiteralType' && LEVELS.has(t.literal.value));
}

/** The standard audit adapter: one logger-backed class, exhaustive level map, failures contained. */
export const auditAdapter = defineRule({
  description: 'Audit adapters implement the domain audit port using a module-scoped logger, an exhaustive level map and contained failures.',
  create(context) {
    const { file } = classifyContext(context);
    const isAdapter = file.area === 'module' && file.layer === 'infrastructure' && (file.dir === 'audit' || file.dir === 'logging') && file.rest.length === 2;
    if (!isAdapter) return {};
    let hasScopedLogger = false;
    let levelMapName = null;
    const classes = [];

    return {
      VariableDeclarator(node) {
        const init = node.init && unwrap(node.init);
        if (init?.type === 'CallExpression' && init.callee.type === 'MemberExpression' && init.callee.property.name === 'withContext') {
          const [options] = init.arguments;
          const hasModule = options?.type === 'ObjectExpression' && options.properties.some((p) => p.key?.name === 'module' && p.value.type === 'Literal' && typeof p.value.value === 'string' && p.value.value.length > 0);
          if (hasModule) hasScopedLogger = true;
        }
        if (node.init?.type === 'TSSatisfiesExpression' && isLevelRecord(node.init.typeAnnotation) && node.id.type === 'Identifier') {
          levelMapName = node.id.name;
        }
      },
      ClassDeclaration(node) {
        classes.push(node);
      },
      'Program:exit'(program) {
        if (!hasScopedLogger) report(context, program, "Create a module-scoped logger: `const auditLogger = logger.withContext({ module: '<module>.audit' })` (from '@lib/logger').");
        if (levelMapName === null) {
          report(context, program, "Define the event→level map as `const LEVEL_BY_EVENT = { … } as const satisfies Record<<Module>Event['type'], 'info' | 'warn'>` so a new event type fails to compile until it has a level.");
        }
        if (classes.length !== 1) {
          report(context, program, `An audit adapter file declares exactly one class (found ${classes.length}).`);
          return;
        }
        const [cls] = classes;
        const implementsPort = (cls.implements ?? []).some((i) => i.expression.type === 'Identifier' && /AuditLog$/.test(i.expression.name));
        if (!implementsPort) report(context, cls.id, 'The adapter must `implements <Module>AuditLog` (the domain port).');
        const record = cls.body.body.find((m) => m.type === 'MethodDefinition' && m.key.name === 'record');
        if (!record) {
          report(context, cls.id, 'The adapter implements `record(event)`.');
          return;
        }
        const body = record.value.body.body;
        const tryStatement = body.find((s) => s.type === 'TryStatement');
        if (!tryStatement || !tryStatement.handler) {
          report(context, record, 'Wrap the logging call in try/catch: auditing must never fail the request it describes.');
          return;
        }
        const rethrows = JSON.stringify(tryStatement.handler.body, (key, value) => (key === 'parent' ? undefined : value)).includes('"ThrowStatement"');
        if (rethrows) report(context, tryStatement.handler, 'The catch block must swallow the logging failure (do not rethrow).');
        const text = context.sourceCode.getText(tryStatement.block);
        if (levelMapName !== null && !text.includes(`[${levelMapName}[`) && !text.includes(`${levelMapName}[`)) {
          report(context, tryStatement.block, `Select the log level through \`${levelMapName}[event.type]\`; do not hard-code levels.`);
        }
      },
    };
  },
});
