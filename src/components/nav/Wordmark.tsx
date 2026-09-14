/**
 * The navigation mark. design.md describes a flat geometric glyph in the action
 * color beside the wordmark, so this is exactly that and nothing more — two
 * offset triangles, flat fills, no gradient or shadow.
 */
export function Wordmark() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      aria-hidden="true"
      focusable="false"
      className="shrink-0"
    >
      <path d="M9 1 1 15h7L9 1Z" fill="var(--color-accent)" />
      <path d="M11 5 19 19h-7L11 5Z" fill="var(--color-ink)" />
    </svg>
  );
}
