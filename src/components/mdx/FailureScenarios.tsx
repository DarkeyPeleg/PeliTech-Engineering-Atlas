/**
 * Failure-mode table: what breaks, what the user sees, and what you do about it.
 *
 * Forcing all three columns is the point — a failure listed without a mitigation
 * is an incomplete answer, and the structure makes that omission visible while
 * writing.
 */

export interface FailureScenario {
  /** What goes wrong. */
  failure: string;
  /** What the user or system observes. */
  impact: string;
  /** How the design handles or contains it. */
  mitigation: string;
}

interface FailureScenariosProps {
  scenarios: FailureScenario[];
  caption?: string;
}

export function FailureScenarios({ scenarios, caption }: FailureScenariosProps) {
  return (
    <figure className="my-24 overflow-x-auto">
      <table className="w-full border-collapse text-left font-charlie-text text-ui">
        <thead>
          <tr className="border-b border-border-disabled">
            <th scope="col" className="px-12 py-8 font-medium text-ink">
              Failure
            </th>
            <th scope="col" className="px-12 py-8 font-medium text-ink">
              Impact
            </th>
            <th scope="col" className="px-12 py-8 font-medium text-ink">
              Mitigation
            </th>
          </tr>
        </thead>
        <tbody>
          {scenarios.map((scenario) => (
            <tr key={scenario.failure} className="border-b border-border-subtle align-top">
              <th scope="row" className="px-12 py-12 font-medium text-ink">
                {scenario.failure}
              </th>
              <td className="px-12 py-12 text-ink-body">{scenario.impact}</td>
              <td className="px-12 py-12 text-ink-body">{scenario.mitigation}</td>
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

export default FailureScenarios;
