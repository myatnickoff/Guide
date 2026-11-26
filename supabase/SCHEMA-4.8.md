# Schema 4.8 (stage 10.3) — draft

Additive migration: `migrations/202611260001_stage10_schema_4_8.sql`.

**Do not apply this file to production or the live Supabase project without explicit owner approval.** It has not been applied there.

Architecture (project docs): `stages/stage-10-3-architecture.md` in the MoveExploreGrow working folder. Snapshot types updated with empty/false defaults only; no invented coordinates, photos, phones, socials, or owner approvals.

Partner-link labels are unchanged from 4.7 (`Партнёрская ссылка` / `Партнёр`). The `practical_legal_facts` table is empty on purpose.

Local check 26.11.2026: applied on a throwaway PostgreSQL 17 database on top of 4.7, then dropped. Not applied to Supabase.
