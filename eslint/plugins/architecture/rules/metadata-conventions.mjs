import { classifyContext, defineRule, report } from '../util.mjs';

function containsRobotsNoIndex(node) {
  let found = false;
  const visit = (n) => {
    if (!n || typeof n.type !== 'string' || found) return;
    if (n.type === 'Property' && n.key.name === 'robots' && n.value.type === 'ObjectExpression') {
      found = n.value.properties.some((p) => p.type === 'Property' && p.key.name === 'index' && p.value.type === 'Literal' && p.value.value === false);
    }
    for (const key of Object.keys(n)) {
      if (key === 'parent') continue;
      const child = n[key];
      if (Array.isArray(child)) child.forEach(visit);
      else if (child && typeof child.type === 'string') visit(child);
    }
  };
  visit(node);
  return found;
}

function callsBuilder(node) {
  let found = false;
  const visit = (n) => {
    if (!n || typeof n.type !== 'string' || found) return;
    if (n.type === 'CallExpression' && n.callee.type === 'Identifier' && n.callee.name === 'buildLocalizedMetadata') found = true;
    for (const key of Object.keys(n)) {
      if (key === 'parent') continue;
      const child = n[key];
      if (Array.isArray(child)) child.forEach(visit);
      else if (child && typeof child.type === 'string') visit(child);
    }
  };
  visit(node);
  return found;
}

/** A page that only calls `notFound()` renders nothing, so there is nothing to describe or index. */
function onlyCallsNotFound(declaration) {
  const body = declaration?.body?.type === 'BlockStatement' ? declaration.body.body : null;
  return (
    body !== null &&
    body.length === 1 &&
    body[0].type === 'ExpressionStatement' &&
    body[0].expression.type === 'CallExpression' &&
    body[0].expression.callee.type === 'Identifier' &&
    body[0].expression.callee.name === 'notFound'
  );
}

/**
 * Every page declares metadata, and its indexability is a decision:
 * public pages use `buildLocalizedMetadata` (canonical + alternates in one
 * place), internal pages say `robots: { index: false }`. ESLint cannot judge
 * the quality of the text; that stays with review and integration tests.
 */
export const metadataConventions = defineRule({
  description: 'Pages export metadata that is either built with buildLocalizedMetadata (public) or explicitly noindex (internal); no hand-built canonicals or head tags.',
  create(context) {
    const { file } = classifyContext(context);
    const isPage = file.area === 'app' && /\/page\.tsx$/.test(file.path);
    const isAppFile = file.area === 'app' && /\.tsx?$/.test(file.path);
    if (!isAppFile) return {};
    let metadataNode = null;
    let defaultExport = null;

    return {
      ExportDefaultDeclaration(node) {
        defaultExport = node.declaration;
      },
      ExportNamedDeclaration(node) {
        const d = node.declaration;
        if (d?.type === 'FunctionDeclaration' && d.id.name === 'generateMetadata') metadataNode = d;
        if (d?.type === 'VariableDeclaration') {
          const m = d.declarations.find((x) => x.id.type === 'Identifier' && x.id.name === 'metadata');
          if (m) metadataNode = m;
        }
        if (!d && node.specifiers.some((s) => s.exported.name === 'generateMetadata' || s.exported.name === 'metadata')) metadataNode = node;
      },
      Property(node) {
        if (node.key.type === 'Identifier' && node.key.name === 'canonical') {
          report(context, node, "Do not build canonical URLs by hand. `buildLocalizedMetadata({ locale, pathname, title, description })` from '@lib/seo' produces the canonical and language alternates in one place.");
        }
      },
      JSXOpeningElement(node) {
        const name = node.name.type === 'JSXIdentifier' ? node.name.name : null;
        if (name === 'title' || name === 'meta' || (name === 'link' && node.attributes.some((a) => a.name?.name === 'rel' && a.value?.value === 'canonical'))) {
          report(context, node, `Do not render <${name}> in a page. Declare it through the Metadata API so it is not duplicated or contradicted.`);
        }
      },
      'Program:exit'(program) {
        if (!isPage) return;
        if (metadataNode === null && onlyCallsNotFound(defaultExport)) return;
        if (metadataNode === null) {
          report(context, program, 'Every page exports `metadata` or `generateMetadata`. Public pages: `buildLocalizedMetadata(...)` from \'@lib/seo\'; internal pages: `robots: { index: false }`.');
          return;
        }
        if (!callsBuilder(metadataNode) && !containsRobotsNoIndex(metadataNode)) {
          report(context, metadataNode.id ?? metadataNode, 'Make indexability intentional: build public metadata with `buildLocalizedMetadata` (canonical + alternates), or mark an internal page `robots: { index: false }`.');
        }
      },
    };
  },
});
