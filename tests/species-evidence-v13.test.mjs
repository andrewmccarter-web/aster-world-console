import test from 'node:test';
import assert from 'node:assert/strict';

import {
  EVIDENCE_STATUS,
  listAssociations,
  assessAssociation
} from '../previews/reedwater-miniature/assets/species-evidence-v13.js';

test('registry starts without approved associations', () => {
  assert.deepEqual(listAssociations(), []);
});

test('missing evidence is never treated as verified', () => {
  const result = assessAssociation(null);
  assert.equal(result.speciesIdentityVerified, false);
  assert.equal(result.morphologyVerified, false);
  assert.equal(result.occurrenceVerified, false);
  assert.equal(result.usableAsCanonicalRepresentation, false);
});

test('identity evidence does not imply morphology or occurrence', () => {
  const result = assessAssociation({
    speciesId: 'DTSP-001-0002',
    identityStatus: EVIDENCE_STATUS.VERIFIED,
    identitySource: 'fixture-only'
  });

  assert.equal(result.speciesIdentityVerified, true);
  assert.equal(result.morphologyVerified, false);
  assert.equal(result.occurrenceVerified, false);
  assert.equal(result.usableAsCanonicalRepresentation, false);
});

test('morphology alone does not establish species identity', () => {
  const result = assessAssociation({
    morphologyStatus: EVIDENCE_STATUS.VERIFIED,
    morphologySource: 'fixture-only'
  });

  assert.equal(result.speciesIdentityVerified, false);
  assert.equal(result.morphologyVerified, true);
  assert.equal(result.usableAsCanonicalRepresentation, false);
});
