import { createHighlighter, type Highlighter } from 'shiki';
import alGrammar from './langs/al';

/**
 * Syntax highlighting happens at build time, so no highlighter ships to the
 * browser. Languages are an explicit allowlist rather than the full 346-grammar
 * bundle, which keeps build time and memory bounded — add a language here to
 * make it available to authors.
 */

export const SUPPORTED_LANGUAGES = [
  // Requested in the project brief
  'typescript',
  'javascript',
  'python',
  'java',
  'cpp',
  'sql',
  'bash',
  'json',
  'yaml',
  'dart',
  // AL is not bundled by Shiki; see ./langs/al.ts
  // Useful for the kind of content this site hosts
  'tsx',
  'jsx',
  'go',
  'rust',
  'csharp',
  'php',
  'ruby',
  'kotlin',
  'swift',
  'html',
  'css',
  'graphql',
  'toml',
  'ini',
  'diff',
  'docker',
  'nginx',
  'http',
  'prisma',
  'xml',
  'csv',
  'powershell',
  'terraform',
  'hcl',
  'protobuf',
] as const;

/** `text` renders unhighlighted; Shiki treats it as a special language. */
export const PLAIN_LANGUAGE = 'text';

/**
 * The Dark Panel treatment from design.md. Only a dark theme is loaded — the
 * design system is light-canvas with inverted code blocks, so a light code theme
 * would never be used.
 */
export const CODE_THEME = 'github-dark-default';

let highlighterPromise: Promise<Highlighter> | null = null;

export function getHighlighter(): Promise<Highlighter> {
  highlighterPromise ??= createHighlighter({
    themes: [CODE_THEME],
    langs: [...SUPPORTED_LANGUAGES, alGrammar],
  });
  return highlighterPromise;
}

const languageAliases: Record<string, string> = {
  ts: 'typescript',
  js: 'javascript',
  py: 'python',
  'c++': 'cpp',
  sh: 'bash',
  shell: 'bash',
  zsh: 'bash',
  yml: 'yaml',
  dockerfile: 'docker',
  'business-central': 'al',
  plaintext: PLAIN_LANGUAGE,
  txt: PLAIN_LANGUAGE,
  plain: PLAIN_LANGUAGE,
};

export function resolveLanguage(language: string | undefined): string {
  if (!language) return PLAIN_LANGUAGE;
  const normalized = language.toLowerCase();
  const aliased = languageAliases[normalized] ?? normalized;
  if (aliased === 'al' || aliased === PLAIN_LANGUAGE) return aliased;
  return (SUPPORTED_LANGUAGES as readonly string[]).includes(aliased) ? aliased : PLAIN_LANGUAGE;
}

/** Human label for the language chip on a code block. */
const displayNames: Record<string, string> = {
  typescript: 'TypeScript',
  javascript: 'JavaScript',
  tsx: 'TSX',
  jsx: 'JSX',
  python: 'Python',
  java: 'Java',
  cpp: 'C++',
  csharp: 'C#',
  sql: 'SQL',
  bash: 'Bash',
  json: 'JSON',
  yaml: 'YAML',
  dart: 'Dart',
  al: 'AL',
  go: 'Go',
  rust: 'Rust',
  php: 'PHP',
  ruby: 'Ruby',
  kotlin: 'Kotlin',
  swift: 'Swift',
  html: 'HTML',
  css: 'CSS',
  graphql: 'GraphQL',
  toml: 'TOML',
  ini: 'INI',
  diff: 'Diff',
  docker: 'Dockerfile',
  nginx: 'nginx',
  http: 'HTTP',
  prisma: 'Prisma',
  xml: 'XML',
  csv: 'CSV',
  powershell: 'PowerShell',
  terraform: 'Terraform',
  hcl: 'HCL',
  protobuf: 'Protobuf',
  [PLAIN_LANGUAGE]: 'Text',
};

export function languageLabel(language: string | undefined): string | null {
  const resolved = resolveLanguage(language);
  if (resolved === PLAIN_LANGUAGE) return null;
  return displayNames[resolved] ?? resolved;
}
