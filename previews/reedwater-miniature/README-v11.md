# Reedwater v0.11 — static blade clearance

Parent: `82db1babfd248a43c5584b36ff27c810252ee239` (v0.10).
Earlier previews and all their assets are unchanged.

## Fix

v0.10 placed laminae without testing separation. v0.11 uses radial whorls,
staggered tiers and open fan arcs with individual attachment supports.
The generator expands attachment spacing until every blade's oriented
bounding box separates from every other blade's box. The boxes contain the
entire solid meshes, so their separation certifies blade-to-blade separation
for these static assets. Generation throws if it cannot find a certified layout.

The test uses all 15 separating-axis candidates for two oriented boxes, with
a 0.025 model-unit margin before juvenile scaling. Geometry and templates
remain cached. The existing surface materials and solid ribbed meshes are reused.

World placement now reserves conservative horizontal footprints between plants,
the outer edge, river and building zone. Instance scales were adjusted for the
more open silhouettes; density changes accordingly. Narrow desktop windows
use the bottom inspector layout up to 850 CSS pixels.

## Scope

This is static layout clearance, not runtime collision physics or a wind solver.
Intended support/hub attachments are not required to separate. The blade test
does not certify every support, rock, terrain or building triangle.

All plant anatomy, development, optical properties, scale and ecology remain
**PROVISIONAL** and unassigned to a canonical taxon. No private canon, simulation
state or operational register is modified.

## Executed checks — 20 October 2026

- Node and browser checks: all 18 form/palette/stage combinations have zero
  overlapping conservative blade-box pairs; 510 pairs checked.
- Regression baseline: the same conservative checker detects suspect overlaps
  in v0.10. Overlapping boxes are not themselves exact triangle-collision counts.
- Positive/negative overlap fixtures PASS; finite geometry/normals/UVs, valid
  topology, watertight positive-volume lamina, clone independence and smaller
  juvenile bounds PASS.
- Local WebGL: revised scene population, whorl, tiered side view and fan top
  view inspected. Paired comparison and 390 × 640 portrait framing checked.
- Node syntax checks for the viewer and new control/clearance modules PASS.
- Physical mobile GPU, battery and multi-touch hardware remain untested.

Open `v11-desktop.html` through HTTP. Repeatable browser checks are at
`asset-check-v11.html`. Only the normal automatic Pages deployment is used;
no manual workflow dispatch or main-branch merge.
