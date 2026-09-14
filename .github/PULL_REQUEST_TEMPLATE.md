<!--
One logical change per pull request. A correction and a new article are two pull requests.
-->

## What this changes

<!-- A sentence or two. Link the issue if there is one. -->

## Why

<!--
For a correction: what was wrong, and what makes the new version right.
For a new article: what a reader learns that they would not find elsewhere.
For code: what problem this solves.
-->

## Verification

<!--
Content: which claims you checked and against what — a version number, a specification, documentation,
a benchmark, a reproduction. Claims that cannot be checked will be asked about in review, so it saves
a round trip to record them here.

Code: what you tested, and how.
-->

## Checklist

- [ ] `npm run check` passes
- [ ] For content: trade-offs are stated, and the article says when its advice stops applying
- [ ] For content: version-specific claims name the version
- [ ] Diagrams use the semantic node classes and have a `caption`
- [ ] No hardcoded colours or off-system utilities (`npm run validate` covers this)
- [ ] `lastUpdated` bumped if an existing article changed substantively
