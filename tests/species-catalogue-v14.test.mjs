
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {validateCatalogue, searchSpecies, guideURL}
  from '../previews/reedwater-miniature/assets/species-catalogue-v14.js';

const source = JSON.parse(fs.readFileSync(
  new URL('../previews/reedwater-miniature/data/reedwater_species_catalogue_v14.json',
          import.meta.url), 'utf8'));

test('all 437 source records load with placement blocked', () => {
  const records = validateCatalogue(source);
  assert.equal(records.length, 437);
  assert.equal(new Set(records.map(r=>r.species_id)).size, 437);
});

test('search matches a real source species ID', () => {
  const records = validateCatalogue(source);
  assert.equal(
    searchSpecies(records, records[0].species_id).length, 1
  );
});

test('guide link preserves requested species identity', () => {
  const id = source.species[0].species_id;
  const url = guideURL(id, 'http://localhost:8765/guide.html');
  assert.equal(new URL(url).searchParams.get('species'), id);
  assert.equal(guideURL('unknown', 'http://localhost:8765/guide.html'), null);
});

test('rejects false physical-placement authority', () => {
  const changed = structuredClone(source);
  changed.scene_policy.physical_placement_authorised = true;
  assert.throws(() => validateCatalogue(changed));
});

test('rejects claimed verified occurrence', () => {
  const changed = structuredClone(source);
  changed.species[0].physical_scene_placement_verified = true;
  assert.throws(() => validateCatalogue(changed));
});
