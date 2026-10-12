# pbvinge.com development on the Mac mini

Canonical checkout: `/Users/shrinkbot/Documents/ChatGPT/pbvinge.com`.
Read `docs/MAC-SETUP-STATUS.txt` for the current checkpoint and
`docs/MAC-DEVELOPMENT.txt` for the verified commands. The original planning
handoff is preserved byte-for-byte in `docs/MAC-HANDOFF.txt`.

- Preserve the entire `public/archives/91st` source directory.
- Use a feature branch. Pushes to `main` may deploy Cloudflare Pages; this
  publish only when the user explicitly authorizes the release. Pages settings
  remain a separate change requiring verified configuration evidence.
- This branch uses npm with `package-lock.json`. Install with
  `npm ci --ignore-scripts --no-audit --no-fund`; the verified build needs no
  dependency lifecycle scripts. No root postinstall repair helper is required.
- The approved framework upgrade uses pinned Astro 7, React integration 7 and
  Tailwind 4. Preserve collection IDs and the unified Markdown processor; read
  `docs/FRAMEWORK-UPGRADE-2026-10-12.txt` before changing these compatibility
  choices. Compare Pages runtime/build evidence before production integration.
- Disable Astro telemetry for task processes with `ASTRO_TELEMETRY_DISABLED=1`.
  Keep shared Node defaults unchanged and bind development servers to loopback.
- Audio transcription and historical book migration are retired. Their original
  code and timestamp tests are preserved as text in `docs/retired-workflows/`;
  do not install their model dependencies or run archived content helpers as tests.
- The Obsidian publisher remains unidentified. Do not enable another publisher
  or schedules during this transfer. Keep laptop preservation and final content
  cutover as explicit unresolved checks until verified.
