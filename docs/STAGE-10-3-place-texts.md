# Stage 10.3 — rewritten place descriptions (26.11.2026)

All 61 place `short_description` and `why_visit` texts in `content/snapshot.json` were rewritten in original Russian.

- Google Maps editorial text was **not** copied (copyright / ToS).
- Facts come from official sites (where the page loaded), OpenStreetMap/Nominatim (coordinates and some opening hours, dated 26.11.2026), Wikipedia, and a November 2026 viewpoints overview that cites TAT.
- Hours, prices and coordinates appear only with a dated source. Phones were not added.
- Coordinates were stored only when the OSM match was clearly the same place (48 of 61).
- Google Maps star ratings and official Maps hours were not available without a Maps API key or scraping; those gaps are noted in the research folder.
- Places previously dropped from the owner’s Knowledge Gallery (Splash Jungle, etc.) were not added back.
- All rows remain `is_published=false`. Production / main were not changed.

Research notes: `stages/stage-10-3-place-rewrites/` in the MoveExploreGrow working folder.
