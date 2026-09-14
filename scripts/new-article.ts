import fs from 'node:fs/promises';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { CONTENT_DIR } from '../src/lib/content/paths';

/**
 * Scaffolds a new article from a template.
 *
 *   npm run new:article -- --path system-design/scalability/caching --title "Caching"
 *   npm run new:article -- --path case-studies/ecommerce/design --template case-study
 *
 * Beyond saving typing, this exists so the frontmatter is correct on the first
 * attempt: the fields are filled in, the date is today's, and the category is
 * inherited from the section's _meta.json rather than guessed.
 */

const TEMPLATES = ['concept', 'case-study', 'comparison'] as const;
type Template = (typeof TEMPLATES)[number];

function fail(message: string): never {
  console.error(`error: ${message}`);
  console.error(
    '\nusage: npm run new:article -- --path <section/subsection/slug> [--title "Title"] [--template concept|case-study|comparison]',
  );
  process.exit(1);
}

function titleFromSlug(slug: string): string {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/** Reads the nearest ancestor `_meta.json` label, to use as the category. */
async function inheritCategory(segments: string[]): Promise<string> {
  const topLevel = segments[0];
  if (!topLevel) return 'Uncategorised';

  try {
    const raw = await fs.readFile(path.join(CONTENT_DIR, topLevel, '_meta.json'), 'utf8');
    const meta = JSON.parse(raw) as { label?: string };
    if (meta.label) return meta.label;
  } catch {
    // No _meta.json; fall through to the derived name.
  }
  return titleFromSlug(topLevel);
}

function replaceFrontmatterField(source: string, field: string, value: string): string {
  const pattern = new RegExp(`^${field}: .*$`, 'm');
  return source.replace(pattern, `${field}: '${value.replace(/'/g, "''")}'`);
}

async function main(): Promise<void> {
  const { values } = parseArgs({
    options: {
      path: { type: 'string' },
      title: { type: 'string' },
      template: { type: 'string', default: 'concept' },
      description: { type: 'string' },
    },
  });

  const targetPath = values.path?.replace(/^\/+|\/+$/g, '');
  if (!targetPath) fail('--path is required');
  if (!targetPath.includes('/')) {
    fail('--path must include at least a section, e.g. system-design/scalability/caching');
  }

  const template = values.template as Template;
  if (!TEMPLATES.includes(template)) {
    fail(`--template must be one of: ${TEMPLATES.join(', ')}`);
  }

  const segments = targetPath.split('/');
  const slug = segments.at(-1)!;
  const title = values.title ?? titleFromSlug(slug);
  const category = await inheritCategory(segments);
  const today = new Date().toISOString().slice(0, 10);

  const destination = path.join(CONTENT_DIR, `${targetPath}.mdx`);

  try {
    await fs.access(destination);
    fail(`${path.relative(process.cwd(), destination)} already exists`);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
  }

  let content = await fs.readFile(path.join(CONTENT_DIR, '_templates', `${template}.mdx`), 'utf8');

  content = replaceFrontmatterField(content, 'title', title);
  content = replaceFrontmatterField(content, 'category', category);
  content = replaceFrontmatterField(content, 'lastUpdated', today);
  if (values.description) {
    content = replaceFrontmatterField(content, 'description', values.description);
  }

  await fs.mkdir(path.dirname(destination), { recursive: true });
  await fs.writeFile(destination, content, 'utf8');

  const relative = path.relative(process.cwd(), destination);
  console.log(`created ${relative}`);
  console.log(`route   /${targetPath}`);
  console.log('\nNext: write the article, then run `npm run validate`.');

  // A new directory has no label until it gets one, so point that out rather
  // than letting a title-cased folder name ship as navigation.
  const parentDir = path.join(CONTENT_DIR, ...segments.slice(0, -1));
  try {
    await fs.access(path.join(parentDir, '_meta.json'));
  } catch {
    console.log(
      `\nnote: ${path.relative(process.cwd(), parentDir)} has no _meta.json, so its sidebar label will be derived from the folder name.`,
    );
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
