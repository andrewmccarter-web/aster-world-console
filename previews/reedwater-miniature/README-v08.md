# Reedwater miniature v0.8

Isolated visual prototype derived from v0.7 at public branch parent
`e6dc72b110b8febcf4381ee99fb026672d29d9d8`. Earlier previews are unchanged.
Open `v08-desktop.html` through an HTTP server. Three.js 0.160.1 is pinned
to jsDelivr; initial loading needs internet and WebGL.

## Changes

- Reusable cupped-whorl, layered-crown and ribbed-fan factories with indexed,
  curved lamina meshes, shared geometry and per-asset inspection metadata.
- Procedural bump/roughness maps; physical tissue sheen and water clearcoat;
  a locally generated, filtered sky reflection environment. These are artistic
  material settings, not measured ASTER optical properties.
- Continuous river ribbon and continuous depressed channel; circular terrain
  footprint; reserved building clearance and smoother stones.
- Adaptive camera framing, mobile low-quality default with reduced visible
  plant density, keyboard orbit/zoom/Home, Escape to dismiss details, focus
  indicators, and rendering skipped while the document is hidden.

## Evidence boundary

**All geometry, flora, structures, palettes, scales and placements remain
PROVISIONAL. No asset is assigned a canonical species or accepted common name.**
Read-only private C15/C20 records and the Reedwater design brief were checked.
Those records support regional identity candidates and provisional phenotype
hints, but do not establish the anatomy, site overlap, current presence or
co-occurrence depicted here. No private source contents are bundled.
No private canon or operational registers were changed.

## Validation — 20 October 2026

- Node syntax checks: viewer module and botanical module PASS.
- Executed geometry assertions: finite positions/normals/UVs, valid indices,
  all three factories, shared geometry and provisional picking metadata PASS.
- Local WebGL desktop rendering and plant detail selection PASS.
- Close-details focus and keyboard camera action exercised.
- 390 × 640 CSS-pixel iframe rendering: full miniature fits; low-quality
  default and footer controls visible. This is layout QA, not a physical
  mobile-device or multi-touch performance test.
- Water backface winding and portrait framing failed in first render;
  corrected and visually rechecked.
- `asset-check.html` is a repeatable browser geometry/material smoke check.

No workflow dispatch, merge, main-branch edit or canonical admission.
GitHub Pages availability is checked separately after the branch commit.
Full-world integration and biological validation are outside this prototype.
