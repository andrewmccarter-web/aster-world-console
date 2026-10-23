# Reedwater public preview: Field Guide fallback (v18 experimental)

Status: **NONCANONICAL / UNMERGED / NOT DEPLOYED**. Branch is isolated from the integrated guide v17.2, GLB viewer experiments, Mnemosyne M6-F and private simulation state.

## Purpose
A public visitor must never be directed to a Field Guide on the visitor's own `localhost:8765`. The existing v17.2 world and its 437-entry source-linked catalogue remain intact. On public hosts, the guide tab renders a local, read-only catalogue detail via `iframe.srcdoc`. Only explicit loopback hosts (`localhost`, `127.0.0.1`, `::1`) use the pre-existing local detailed guide.

## Provenance contract
The public detail displays registry ID, registry name, guild and parent lineage only from the already validated catalogue record. It explicitly refuses verified occurrence, co-occurrence, anatomy, 3D-model correspondence or native endonym status. It performs no canonical writes, model binding, remote API calls or world placement. Catalogue validation and fail-closed count/placement checks remain in `species-catalogue-v14.js`.

## Acceptance checks
- Offline Node: `node --test previews/reedwater-miniature/tests/public-field-guide-v18.test.mjs`
- Syntax: `node --check previews/reedwater-miniature/assets/public-field-guide-v18.js` and `node --check previews/reedwater-miniature/assets/world-workspace-v17-2.js`
- Serve the branch over HTTP, open `previews/reedwater-miniature/v17-2-unified-desktop.html` from a **non-loopback hostname**; choose a species, click **Read Field Guide**. Confirm no request to localhost:8765, visible identity/guild/lineage, provenance disclaimer, working return to catalogue and unchanged 3D world.
- On loopback with the optional local guide running, verify original detailed guide still works; with the service stopped, document its existing failure separately.
- Verify malformed/missing catalogue fails closed and cannot imply physical placement.
- Repeat on Safari/iPad, keyboard-only desktop, narrow viewport and browser console/network panel; record actual pass/fail evidence.

## Evidence status
GitHub source files and branch comparison verified remotely after commit. **Offline Node execution and physical Safari/iPad acceptance remain BLOCKED / NOT RUN** in this session: container network cannot resolve github.com, and no repository checkout was available. No GitHub Actions, merge or deployment was triggered.

## Next steps
Run the above checks on a local checkout; review visual layout and source-data licensing; only then consider a PR. For the full public game, validate source-linked terrain scene manifest and asset budgets separately. Do not imply this fallback makes the overall simulation or wildlife scene canonically live.
