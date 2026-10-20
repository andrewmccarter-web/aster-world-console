# Reedwater v0.9 — specimen mode

Visual prototype derived from v0.8 at
`2660676c37d7f317ac3f00f8d3ef270e3ecd9edf`.
Earlier previews and their assets remain unchanged.

## Use

Open `v09-desktop.html` through HTTP. Choose a botanical form and press
**Specimen mode**, or select a plant in the miniature and press
**Inspect specimen**. Drag/arrow keys orbit; wheel, pinch, or +/− zoom.
Top and side presets, two light positions, and expanded/juvenile concepts
support visual inspection. **Return to miniature** or Escape restores the
previous world camera. Home and Reset view reset only the current camera.

## Implementation

- Isolated specimen scene/camera rendered by the existing renderer.
- Independent specimen transforms: no world plant is reparented or modified.
- Cached reusable botanical templates with curved supports and an attachment
  hub, expanded and juvenile concepts, and three palette variants.
- Shared original v0.8 material/lamina module remains byte-identical.
- Portrait layout reserves a stage above the controls; low quality reduces
  visible world flora and shadows. Specimen view renders only its study object.
- Visible current-browser FPS/draw-call sample on desktop, no remote telemetry.
- Hidden-world plants excluded from picking; canceled and multi-pointer
  gestures do not select plants.

## Provenance boundary

**All anatomy, developmental stages, materials, palette, scale and placement
remain PROVISIONAL. No canonical species identity or common name is assigned.**
These are unassigned design forms. The private C15/C20 and Reedwater design
sources screened in the v0.8 session did not validate anatomical details,
local presence or co-occurrence. This update makes no new biological claim
and imports no private record contents. No private canon or register changed.

## Executed validation — 20 October 2026

- Node syntax checks for viewer and both new modules: PASS.
- Browser `asset-check-v09.html`: 18 form/stage/palette combinations PASS;
  finite positions/normals/UVs, valid indices, smaller juvenile bounds,
  cached geometry, independent clone transforms and provisional metadata.
- Local WebGL world render, plant selection, selected-plant specimen entry:
  PASS. Juvenile selector, raking light, top preset and Escape return exercised.
- 390 × 640 CSS-pixel iframe: world fits, Low default selected, specimen and
  controls fit without overlap. Layout QA only: physical mobile GPU, battery
  usage and multi-touch hardware remain untested.
- Current desktop preview samples showed approximately 60 fps in both modes;
  specimen samples used 9–30 draw calls across exercised forms/stages.
  This is an observed browser sample, not a repeatable performance benchmark.

No manual Actions dispatch, merge, main-branch edit or canonical admission.
Publication and exact remote-file verification are recorded after deployment.
