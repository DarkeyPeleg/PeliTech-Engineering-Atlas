# Contributing

Thank you for considering a contribution. This project exists because most explanations of system design
either stop at definitions or optimise for interview recall. The value here is depth that survives contact
with production, and that only holds if contributions are held to it.

## Contents

- [Ways to contribute](#ways-to-contribute)
- [Before you start](#before-you-start)
- [Setup](#setup)
- [Content standards](#content-standards)
- [Writing style](#writing-style)
- [Frontmatter](#frontmatter)
- [Diagrams](#diagrams)
- [Code examples](#code-examples)
- [Code contributions](#code-contributions)
- [Design tokens](#design-tokens)
- [Pull requests](#pull-requests)

## Ways to contribute

**Corrections** are the most valuable contribution and need no discussion — open a pull request. This
includes factual errors, outdated claims, broken links and confusing explanations. Technical writing
decays as the underlying technology moves, and fixing that decay is real work.

**Clarifications** — adding a missing failure mode, a trade-off the article glosses over, a diagram where
prose is struggling.

**New articles** — the taxonomy in `docs/` has many empty sections, and each one is an open invitation.
Please open an issue first for a new article, so effort is not duplicated and the framing can be agreed
before it is written.

## Before you start

For anything larger than a correction, open an issue. A short exchange about scope beforehand is cheaper
than a rewrite afterwards, particularly on topics where framing determines most of the article.

Please do not open pull requests that consist of AI-generated content submitted without review. The
failure mode is specific and recognisable: fluent prose, plausible structure, and confident claims that
are subtly wrong — the kind of error a reader cannot catch, which is precisely the kind this project
exists to avoid. Tools are fine; unverified output is not.

## Setup

```bash
nvm use          # Node 22.12+
npm install
npm run dev
```

Before pushing:

```bash
npm run check    # typecheck, lint, content validation, MDX pipeline
```

This is what CI runs.

## Content standards

An article should be able to answer each of these:

**Does it explain the problem before the solution?** A technique is only comprehensible against the
problem it addresses. Articles that open with "X is a technique for Y" and never say what went wrong
without X teach vocabulary rather than judgement.

**Is it accurate as of a specific version?** Say which. "MongoDB does not support transactions" was true
in 2015 and has been false since 4.0. Where an article contradicts a widely-repeated claim, say so
explicitly — correcting outdated conventional wisdom is often the most useful thing it does.

**Does it state the trade-offs?** Every architectural choice costs something. An article presenting a
technique with no drawbacks has not finished thinking, and a reader who adopts it will discover the cost
in production instead.

**Does it say when the advice stops applying?** "Use a message queue" is not advice. "Use a message queue
when the work can tolerate delay and the caller does not need the result, but note that you have just
added a component that can fail independently and a new class of ordering bug" is.

**Are the numbers real?** Use figures you can source or derive. Show the arithmetic in capacity estimates
so a reader can substitute their own inputs — an estimate whose working is hidden cannot be adapted or
checked.

**Would a working engineer learn something?** Not "would this pass an interview". The test is whether
someone who already knows the definitions finds something they did not know.

## Writing style

Write for an engineer who is competent but new to this specific topic. Assume general programming
fluency; assume nothing about the subject.

Prefer the concrete. "Latency rose from 40ms to 900ms once the table passed ten million rows" carries
more than "performance degrades at scale".

Explain the mechanism, not just the outcome. A reader who knows that indexes make queries faster but not
that a B-tree lookup is `O(log n)` page reads cannot reason about the case where the index makes things
worse.

Keep sections useful. Every heading in the templates is optional. An article padded to fill a template is
worse than a short one that answers the question, and section headings become the table of contents, so
empty ones cost the reader navigation.

Avoid "in today's fast-paced world", "it is important to note that", and any sentence that would survive
deletion unchanged.

Use British or American spelling consistently within an article; both are fine.

## Frontmatter

`title` and `description` are required. The description is the meta description and the search result
summary, so make it specific — it is often the only thing a reader sees before deciding to click.

```yaml
---
title: 'Database Indexing'
description: 'How B-tree indexes turn full scans into targeted lookups, why the wrong index is worse than none, and how to tell which you have.'
category: 'Databases'
tags: [indexing, postgresql, query-performance]
difficulty: 'Intermediate'
lastUpdated: '2026-09-14'
relatedTopics:
  - databases/sql/query-optimization
---
```

Set `lastUpdated` when you make a substantive change; it feeds the sitemap and tells readers whether to
trust the version claims. `relatedTopics` entries are validated against real files, so a typo or rename
fails CI rather than shipping a dead link.

Use `draft: true` while a piece is in progress. Drafts render in development and are excluded from
production, the search index and the sitemap.

## Diagrams

Diagrams should carry information that prose cannot. A diagram restating the paragraph above it is
decoration.

Use the semantic node classes rather than colours, so diagrams across the site stay legible in the same
way:

| Class       | Use for                           |
| ----------- | --------------------------------- |
| `service`   | Components we build and run       |
| `datastore` | Databases and durable state       |
| `queue`     | Asynchronous transport            |
| `cache`     | Caches and fast paths             |
| `external`  | Third parties and clients         |
| `highlight` | The one node the diagram is about |

````markdown
```mermaid caption="A write reaches the primary; replicas follow asynchronously."
flowchart LR
    App[API server] --> Primary[(Primary)]
    Primary -.->|replication lag| Replica[(Read replica)]
    class App service
    class Primary datastore
    class Replica datastore
```
````

Always add a `caption`. It is the accessible description as well as the figure label.

Prefer `flowchart` for structure, `sequenceDiagram` for protocols and ordering, `stateDiagram-v2` for
lifecycles, and `erDiagram` for data models. If a diagram needs more than roughly a dozen nodes, it is
usually two diagrams.

## Code examples

Code should clarify the concept. A complete, runnable tutorial belongs elsewhere.

Comment the decisions, not the syntax. `// Retry with jitter so a shared outage does not synchronise every
client's retry` earns its place; `// increment the counter` does not.

Show the realistic version. Examples that omit error handling, transactions or timeouts teach a shape that
fails in production — and readers copy shapes.

Always tag the language, and add `title=""` when the filename matters:

````markdown
```typescript title="webhook-handler.ts"

```
````

## Code contributions

TypeScript is strict, including `noUncheckedIndexedAccess`. Avoid `any`; if a cast is unavoidable, comment
why.

Keep the boundaries that exist. `src/lib/content/` owns reading and modelling content, components render
it, and scripts consume the same content layer as the app. In particular, the MDX pipeline is configured
in exactly one file — `src/lib/content/mdx.ts` — and it should stay that way.

Server components by default. Reach for `'use client'` only where interactivity or a browser API requires
it, and keep those components small so the boundary stays narrow.

Comments should explain constraints and decisions that the code cannot show. A comment describing what the
next line does is noise.

## Design tokens

[`design.md`](design.md) is the styling contract and [`src/app/theme.css`](src/app/theme.css) is its
implementation. Tailwind's default palette and scales are cleared, so utilities outside the system do not
exist — `text-red-500` and `rounded-md` will not compile.

Use the semantic aliases (`text-primary`, `bg-canvas`, `border-hairline`, `text-action`) rather than the
`--brand-*` tokens directly, and never write a hex value in a component. `npm run validate` enforces both.
`/styleguide` renders every token and primitive if you need to see what exists.

If something genuinely cannot be built within the system, raise it as an issue rather than working around
it locally — the answer may be to extend `design.md`.

## Pull requests

One logical change per pull request. A correction and a new article are two pull requests.

In the description, say what changed and why. For content, mention which claims you verified and how — a
version number, a benchmark, a specification, a documentation link. For code, say what you tested.

`npm run check` should pass before you push. Preview deployments are generated for every pull request, so
rendering can be reviewed rather than imagined.

Review is about accuracy and clarity, not gatekeeping. Expect questions on claims that are hard to verify;
that scrutiny is the point.

## Code of conduct

By participating you agree to the [Code of Conduct](CODE_OF_CONDUCT.md).

## License

Contributions are licensed under the [MIT License](LICENSE).
