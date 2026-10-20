// ASTER v12 — read-only species identity adapter.
// Provisional botanical forms have no canonical species assignment.
// Only explicitly approved, evidence-backed bindings may resolve.

export const STATUS = Object.freeze({
  UNASSIGNED: 'PROVISIONAL_UNASSIGNED',
  VERIFIED: 'VERIFIED_SPECIES_IDENTITY'
});

const approvedBindings = Object.freeze({});

export function resolveSpeciesIdentity(plant) {
  const kind = plant?.userData?.kind ?? null;
  const binding = kind ? approvedBindings[kind] : undefined;

  if (!binding || binding.verified !== true) {
    return Object.freeze({
      status: STATUS.UNASSIGNED,
      speciesId: null,
      registryName: null,
      fieldGuideUrl: null,
      reason: 'No evidence-backed species association established.'
    });
  }

  if (!/^DTSP-\d{3}-\d{4}$/.test(binding.speciesId)) {
    throw new Error('Invalid ASTER species identifier');
  }

  return Object.freeze({
    status: STATUS.VERIFIED,
    speciesId: binding.speciesId,
    registryName: binding.registryName,
    fieldGuideUrl: null,
    reason: 'Verified identity; Field Guide location configured by viewer.'
  });
}

export function fieldGuideLink(identity, fieldGuideBase) {
  if (identity?.status !== STATUS.VERIFIED) return null;
  if (!identity.speciesId || !fieldGuideBase) return null;

  const url = new URL(fieldGuideBase, globalThis.location?.href);
  url.searchParams.set('species', identity.speciesId);
  return url.href;
}
