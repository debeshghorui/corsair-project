<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:llm-wiki -->
# LLM Wiki

This project uses the [Karpathy LLM Wiki pattern](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f): a compiled markdown knowledge base so agents can navigate the codebase without reading every file.

## Before exploring code

1. Read **`wiki/index.md`** — find the relevant topic page.
2. Open **only** the source files listed on that page.
3. Use **`wiki/common-tasks.md`** for "change X → edit Y" lookups.
4. Fall back to semantic search / grep only when the wiki does not cover the topic.

## Wiki layout

| Path | Layer | Purpose |
| --- | --- | --- |
| `raw/` | 1 — sources | Immutable inputs (transcripts, notes). Never commit secrets. |
| `wiki/` | 2 — compiled knowledge | Topic pages, cross-links, file pointers |
| `wiki/index.md` | Index | Catalog — read this first |
| `wiki/log.md` | Log | Append-only maintenance history |

Respect `.llmwikiignore` when ingesting from the repo.

## Operations

### Ingest (new knowledge)

When the user adds a source to `raw/` or asks to record a decision:

1. Read the source; never ingest `.env*` or credentials.
2. Create or update the relevant `wiki/*.md` page(s).
3. Update `wiki/index.md` if a new page was added.
4. Add cross-links between related wiki pages.
5. Append an entry to `wiki/log.md` with date, operation, and pages touched.

### Query (answer a question)

1. Read `wiki/index.md` → relevant topic page(s).
2. Cite wiki pages in your answer.
3. Read source files only as needed to confirm or implement.

### Lint (after significant code changes)

When you change architecture, routes, or key file locations:

1. Update affected wiki pages so file paths and descriptions stay accurate.
2. Fix broken cross-links in `wiki/index.md`.
3. Append a lint entry to `wiki/log.md`.

## Page conventions

Each topic page should include:

- **Summary** — one paragraph
- **Key files** — table with path + role
- **Related** — links to other wiki pages

Keep pages factual and path-accurate. Prefer updating existing pages over creating duplicates.
<!-- END:llm-wiki -->
