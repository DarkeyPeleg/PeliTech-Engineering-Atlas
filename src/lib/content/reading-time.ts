/**
 * Reading-time estimate. Deliberately a local function rather than a dependency:
 * the whole calculation is a word count, and we want code and diagram blocks
 * discounted rather than counted as prose.
 */

const WORDS_PER_MINUTE = 220;
/** Code is skimmed, not read word by word. */
const CODE_LINES_PER_MINUTE = 80;
/** A flat allowance per diagram, since Mermaid source is not read as text. */
const SECONDS_PER_DIAGRAM = 20;

const FENCE = /^([`~]{3,})\s*(\S*)/;

export function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

export function estimateReadingTime(markdown: string): number {
  let proseWords = 0;
  let codeLines = 0;
  let diagrams = 0;

  let fenceMarker: string | null = null;
  let inDiagram = false;

  for (const line of markdown.split('\n')) {
    const fence = FENCE.exec(line.trim());

    if (fenceMarker === null && fence?.[1]) {
      fenceMarker = fence[1];
      inDiagram = fence[2]?.toLowerCase() === 'mermaid';
      if (inDiagram) diagrams += 1;
      continue;
    }

    if (fenceMarker !== null) {
      // A closing fence must be at least as long as the opening one.
      if (
        fence?.[1] &&
        fence[1].startsWith(fenceMarker[0]!) &&
        fence[1].length >= fenceMarker.length
      ) {
        fenceMarker = null;
        inDiagram = false;
        continue;
      }
      if (!inDiagram) codeLines += 1;
      continue;
    }

    proseWords += countWords(line);
  }

  const minutes =
    proseWords / WORDS_PER_MINUTE +
    codeLines / CODE_LINES_PER_MINUTE +
    (diagrams * SECONDS_PER_DIAGRAM) / 60;

  return Math.max(1, Math.round(minutes));
}
