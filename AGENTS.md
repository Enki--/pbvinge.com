# pbvinge.com development on the Mac mini

Canonical checkout: `/Users/shrinkbot/Documents/ChatGPT/pbvinge.com`.
Read `docs/MAC-SETUP-STATUS.txt` for the current checkpoint and
`docs/MAC-DEVELOPMENT.txt` for the verified commands. The original planning
handoff is preserved byte-for-byte in `docs/MAC-HANDOFF.txt`.

- Preserve the entire `public/archives/91st` source directory.
- Use a feature branch. Pushes to `main` may deploy Cloudflare Pages; this
  migration does not authorize publishing, merging, or changing Pages settings.
- This branch uses npm with `package-lock.json`. Install with
  `npm ci --ignore-scripts --no-audit --no-fund`; the verified build needs no
  dependency lifecycle scripts. Do not use the existing root postinstall helper
  as proof that native dependencies were repaired.
- Keep Astro on major 4 during the migration. Compare the package manager and
  runtime with actual Pages settings before integrating tooling changes.
- Disable Astro telemetry for task processes with `ASTRO_TELEMETRY_DISABLED=1`.
  Keep shared Node defaults unchanged and bind development servers to loopback.
- Audio transcription and historical book migration are retired. Their original
  code and timestamp tests are preserved as text in `docs/retired-workflows/`;
  do not install their model dependencies or run archived content helpers as tests.
- The Obsidian publisher remains unidentified. Do not enable another publisher
  or schedules during this transfer. Keep laptop preservation and final content
  cutover as explicit unresolved checks until verified.
