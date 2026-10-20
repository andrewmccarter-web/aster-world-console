import test from 'node:test';
import assert from 'node:assert/strict';
import {
  STATUS,
  resolveSpeciesIdentity,
  fieldGuideLink
} from '../previews/reedwater-miniature/assets/species-identity-v12.js';

test('all existing botanical forms remain unassigned', () => {
  for (const kind of ['whorl', 'tiers', 'fan']) {
    const identity = resolveSpeciesIdentity({userData:{kind}});
    assert.equal(identity.status, STATUS.UNASSIGNED);
    assert.equal(identity.speciesId, null);
    assert.equal(identity.fieldGuideUrl, null);
    assert.equal(fieldGuideLink(identity, 'https://example.org/guide.html'), null);
  }
});

test('unknown objects cannot acquire identities', () => {
  const identity = resolveSpeciesIdentity({userData:{feature:'structure'}});
  assert.equal(identity.speciesId, null);
});

test('no identity exists without a registered binding', () => {
  assert.equal(resolveSpeciesIdentity(null).status, STATUS.UNASSIGNED);
  assert.equal(resolveSpeciesIdentity({userData:{kind:'unknown'}}).speciesId, null);
});
