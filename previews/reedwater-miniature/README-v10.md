# Reedwater v0.10 — surfaces and paired comparison

Isolated visual prototype derived from v0.9 at
`ae88a8b08ce6c7e7ec9cbfa211d4351bd853eb7d`.
No previous preview or existing asset is modified.

## Use

Open `v10-desktop.html` through HTTP. Enter Specimen mode or select a plant
and choose Inspect specimen. **Compare stages** shows expanded and juvenile
concepts side by side. Both panes use the same camera, display scale, material
and lighting. Orbit and zoom affect both together. **Single specimen** returns
to the developmental selector. Escape or Return to miniature restores the
world view. No real-world units or biological growth ratios are asserted.

## Changes

- Closed solid lamina meshes with edge thickness, raised ribs and midrib,
  cupping, deterministic edge ripples and three geometry variants.
- New procedural base-color, bump and roughness maps, with linear data maps
  and an sRGB color map. Material parameters remain creative approximations.
- Two scissored specimen panes share a camera and the expanded form's framing,
  rather than independently enlarging the juvenile. Floor size also matches.
- Paired-view labels and controls adapt to portrait layout. The development
  selector is disabled while both stages are displayed.
- Original v0.8 surfaces and v0.9 factories are reused as unchanged dependencies;
  the v0.10 wrapper only replaces the lamina meshes in independent instances.

## Evidence boundary

**PROVISIONAL: all anatomy, development, pigmentation, material properties,
scale and placement. No canonical taxon identity or common name is assigned.**

Read-only private checks revisited the Reedwater design brief, the species
design generator's source gate, and the scope of recovered anatomy locks.
The brief still describes proposed art direction, the generator still marks
morphology/life cycle unvalidated, and the inspected lock evidence does not
establish these botanical forms. This is scoped source screening, not an
exhaustive archive audit. No private record contents are bundled; private canon,
registers, workflows and simulation state are untouched.

## Executed validation — 20 October 2026

- Node syntax checks: viewer module and both new JavaScript modules PASS.
- `asset-check-v10.html`: closed lamina has no degenerate faces, every edge
  has exactly two incident faces and signed volume is positive; PASS.
- All 18 form/palette/stage combinations: finite geometry/normals/UVs, valid
  indices, smaller juvenile bounds, cached geometry, independent transforms,
  and PROVISIONAL metadata PASS.
- Local desktop WebGL: surface detail and paired comparison visually verified.
- 390 × 640 iframe: low-quality default, both stage labels, paired subjects,
  comparison toggle and inspector controls visible without overlap.
- Physical-phone GPU, battery usage and multi-touch hardware are not tested.
  The visible desktop FPS sample is observational, not a device benchmark.

No manual Actions dispatch, merge, main edit or canonical promotion.
Post-deployment readback and publication results are recorded separately.
