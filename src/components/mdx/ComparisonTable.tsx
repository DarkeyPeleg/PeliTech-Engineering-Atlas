/**
 * The structured comparison at the heart of every "X vs Y" decision article.
 *
 * A component rather than a markdown table so the row labels stay a separate
 * column from the values, the layout survives a third option being added, and
 * the shape is validated by TypeScript instead of by eyeballing pipes.
 *
 *   <ComparisonTable
 *     options={['PostgreSQL', 'MongoDB']}
 *     rows={[
 *       { aspect: 'Schema', values: ['Enforced by the database', 'Enforced by the application'] },
 *     ]}
 *   />
 */

export interface ComparisonRow {
  aspect: string;
  values: string[];
}

interface ComparisonTableProps {
  options: string[];
  rows: ComparisonRow[];
  /** Header for the leftmost column. */
  aspectLabel?: string;
  caption?: string;
}

export function ComparisonTable({
  options,
  rows,
  aspectLabel = 'Aspect',
  caption,
}: ComparisonTableProps) {
  return (
    <figure className="my-24 overflow-x-auto">
      <table className="w-full border-collapse text-left font-charlie-text text-ui">
        <thead>
          <tr className="border-b border-border-disabled">
            <th scope="col" className="px-12 py-8 font-medium text-ink-muted">
              {aspectLabel}
            </th>
            {options.map((option) => (
              <th key={option} scope="col" className="px-12 py-8 font-medium text-ink">
                {option}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.aspect} className="border-b border-border-subtle align-top">
              <th scope="row" className="px-12 py-12 font-medium text-ink">
                {row.aspect}
              </th>
              {options.map((option, columnIndex) => (
                <td key={option} className="px-12 py-12 text-ink-body">
                  {row.values[columnIndex] ?? '—'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {caption ? (
        <figcaption className="mt-8 font-charlie-text text-caption text-ink-muted">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

export default ComparisonTable;
