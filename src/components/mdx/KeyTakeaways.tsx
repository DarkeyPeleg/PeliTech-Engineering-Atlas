/**
 * The short list a reader should leave with. Placed at the top of long articles
 * or the end of short ones — the author decides.
 */
export function KeyTakeaways({ points }: { points: string[] }) {
  return (
    <div className="my-24 rounded-cards bg-surface-soft px-24 py-20">
      <p className="mb-12 font-charlie-text text-caption font-medium tracking-wide text-ink uppercase">
        Key takeaways
      </p>
      <ul className="m-0 list-disc pl-20">
        {points.map((point) => (
          <li key={point} className="mb-8 font-charlie-text text-body text-ink-body last:mb-0">
            {point}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default KeyTakeaways;
