# ASTER full settlement regression — local execution receipt

Date reported: 2026-10-25 (Europe/London). Source: user-supplied Mac mini terminal stdout from executing `node tests/verify_full_settlements.cjs` after cloning branch `validation/full-settlement-regression-20261024`.

## Result

**PASS (user-reported local execution; stdout inspected in conversation).** Authority: `DERIVED-PROVISIONAL_OBSERVER_ONLY`. This receipt does not assert a GitHub Actions or independent remote execution.

- Records checked: 206,302; IDs unique: 206,302.
- Upper settlements: 1,073; decompressed lower-level settlements: 205,229.
- Classes: conurbations 17; cities 76; towns 980; villages 15,492; hamlets 189,737.
- Seven lower-level compressed data files decoded, parsed and processed.
- v5 overlapping pairs: (6,7), (29,30); v6 overlapping pairs: none.
- Test assertions cover finite coordinates, valid island indices, original v5 containment, v6 transformed display containment and fixed classification totals.

## Per-file record counts and SHA-256 (hash of checked compressed .txt file)

| File | Rows | SHA-256 |
|---|---:|---|
| `data/lower_reedwater_1.txt` | 35,915 | `c13bc124dffbbfc1e8f08cac19419361dc99ed2984089b74aabc768affa9d941` |
| `data/lower_reedwater_2.txt` | 35,915 | `4d5bb588d4436009c3e3a39f708d1aa15f486d461883517f79bc4c3aac1c76a5` |
| `data/lower_broadroot.txt` | 47,202 | `35b4034b81ec76dda54608d52d20f1db401181df14ca483da8d51d864fa08b32` |
| `data/lower_redvale.txt` | 34,889 | `892e927542027d2c225c372f685ef7001857c21901e246df464f25e93a40b929` |
| `data/lower_skyglass.txt` | 20,523 | `af6f95d8bc0e1bd6d784e389205cae53793d7dcb02d71587e77b7e641bb0216a` |
| `data/lower_crosscurrent.txt` | 16,418 | `00c076b5eb42d169ddd9d59bec6b355e295b7f6af0c6036d279d6e6fd2a8e3f5` |
| `data/lower_siltwatch.txt` | 14,367 | `6fca5dd2fb31710d9a6c690e480580cece91325d19f67376c5c70ca1fbc02b20` |

## Scope and limits

The v6 affine view is display-only, **not** canonical world geometry. This result does not validate terrain, rivers, ports, physical calculations, the live UI on Safari, or exact identity crosswalk against private canonical archives. No canonical promotion, deployment, merge, or GitHub Actions execution is authorized by this receipt.

Next: review the isolated test branch for merge into the public console, and separately reconcile the private operational register's older `NOT_RELEASED` marker wording with the actual public upper-level explorer. Do not conflate these actions.
