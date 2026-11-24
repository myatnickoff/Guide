# Stage 9 — MVP 16+ (RU), preview branch `stage-9-mvp-16plus`

- Content: `content/snapshot.json` (export of schema 4.7 seeds). All rows `is_published=false`.
- Preview shows drafts only when `PREVIEW_SHOW_UNPUBLISHED=1` (Vercel topguide → Preview, this branch only). Production never shows unpublished rows (`VERCEL_ENV=production` guard).
- District pages `/phuket/<slug>` are always routable (MUST-KEEP URLs).
- Partner blocks: label «Партнёрская ссылка» / «Партнёр», `rel="sponsored noopener noreferrer"`.
- 21+ promo, `/21-plus`, concierge block, Privacy Notice: not published (later stages).
- DB: `supabase/migrations/202611240001_stage9_guide_schema_4_7.sql` + `supabase/seed/01..04` — additive, not yet applied to the live project.
- `vercel.json` ignoreCommand skips builds for commits that change only `content/snapshot.json`.
