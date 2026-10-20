// ASTER v13 — evidence registry.
// Read-only experimental metadata, not canonical simulation data.

export const EVIDENCE_STATUS = Object.freeze({
  UNVERIFIED: 'UNVERIFIED',
  SUPPORTED: 'SUPPORTED',
  VERIFIED: 'VERIFIED'
});

// No species/model associations have been approved.
const associations = Object.freeze([]);

export function listAssociations() {
  return [...associations];
}

export function assessAssociation(record) {
  if (!record || typeof record !== 'object') {
    return Object.freeze({
      speciesIdentityVerified: false,
      morphologyVerified: false,
      occurrenceVerified: false,
      usableAsCanonicalRepresentation: false
    });
  }

  const speciesIdentityVerified =
    record.identityStatus === EVIDENCE_STATUS.VERIFIED &&
    Boolean(record.speciesId) &&
    Boolean(record.identitySource);

  const morphologyVerified =
    record.morphologyStatus === EVIDENCE_STATUS.VERIFIED &&
    Boolean(record.morphologySource);

  const occurrenceVerified =
    record.occurrenceStatus === EVIDENCE_STATUS.VERIFIED &&
    Boolean(record.occurrenceSource);

  return Object.freeze({
    speciesIdentityVerified,
    morphologyVerified,
    occurrenceVerified,
    usableAsCanonicalRepresentation:
      speciesIdentityVerified && morphologyVerified
  });
}
