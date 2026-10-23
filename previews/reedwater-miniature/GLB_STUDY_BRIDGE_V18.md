# Reedwater public GLB study bridge — 23 October 2026

**Status: EXPERIMENTAL / NONCANONICAL / UNMERGED / NOT DEPLOYED.**

## Scope
Adds a separate **3D asset study** link to the existing v17.2 Reedwater Explorer (retaining the v18 public-safe Field Guide fallback). The study adapts the existing ASTER-WORLD `experiment/world-console-glb-20261021` viewer and the exact bounded `glb_gate.mjs` admission logic. The visitor can import a local self-contained GLB, inspect geometry, orbit and frame it, select animation clips and play/pause. Nothing is uploaded or assigned to a catalogue species. The Reedwater landscape remains unchanged; this is **not yet in-world wildlife integration**.

The original private GLB viewer has vendored Three.js r170 and a recorded 46.6 MB standing-loop sample. This public branch intentionally does **not** duplicate that binary or proprietary/external local assets. It uses version-pinned Three.js r170 modules from jsDelivr. This is a network dependency, not offline acceptance. A later public release should vendor the permitted MIT modules and their license, host vetted compressed/optimised assets and validate the associated licensing, network loading and memory budget. The viewer has no canonical physical scale, occurrence, identity, gait or G4-clock binding.

## Source
- Private source: `ASTER-WORLD/simulation/world_console_v0_3_cartography/glb_preview/viewer.js` and `glb_gate.mjs` on `experiment/world-console-glb-20261021`.
- Private execution receipt: `research/integration_experiments/world_console_glb/RECEIPT.md` on that branch. Its historical PASS claims are **not** new tests of this public adaptation.
- Public baseline: `experiment/reedwater-public-guide-fallback-20261023`; earlier `experiment/reedwater-integrated-guide-v17` remains unchanged.
- No claim that newer local v18.x Explorer work is present or reconciled.

## Acceptance before merge
1. From the public repo root run `node previews/reedwater-miniature/tests/glb-study-bridge-v18.test.mjs` and `node previews/reedwater-miniature/tests/public-field-guide-v18.test.mjs`.
2. Run `node --check` on `glb-study/viewer.js`, `glb-study/glb_gate.mjs` and `assets/world-workspace-v17-2.js`.
3. Serve the repo over HTTP; open `previews/reedwater-miniature/v17-2-unified-desktop.html`, follow **3D asset study**, import a known good self-contained GLB, verify orbit/framing/clip playback and return navigation. Verify malformed GLB and external-resource URIs fail closed.
4. Confirm no GLB upload, no localhost calls on public host, no model/species binding and no world-state mutation. Inspect browser network requests: only expected static files and CDN modules.
5. Test iPad Safari file picker, memory, pinch/rotate and portrait layout. Check accessibility and GLB asset licensing. Record actual browser and hardware evidence.

**Execution status:** Source and branch readback checks can verify remote commits. Offline Node, browser, iPad and CDN integration tests have **not been executed in this GitHub-only session**. No merge, GitHub Actions, public deployment or canonical changes were requested or performed.

## Next action
Obtain a capable local checkout and run tests, then reconcile with any more recent v18.x Explorer work. If accepted, move from standalone file study to approved hosted asset loading with source-linked scene manifests and explicit model/species/occurrence gates.
