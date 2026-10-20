import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const root = new URL('../previews/reedwater-miniature/', import.meta.url);
const read = name => readFileSync(new URL(name, root), 'utf8');

const html = read('v17-2-unified-desktop.html');
const js = read('assets/world-workspace-v17-2.js');
const world = read('v17-2-world-embedded.html');
const source = read('v16-desktop.html');
const records = JSON.parse(read('data/reedwater_species_catalogue_v14.json'));

test('unified workspace retains both information tabs', () => {
  assert.match(html, /id=["']species-tab["']/);
  assert.match(html, /id=["']guide-tab["']/);
});

test('redundant floating catalogue is suppressed', () => {
  assert.match(html, /ASTER_V17_2_REMOVE_DUPLICATE_CATALOGUE/);
  assert.match(html, /#aster-catalogue-open/);
});

test('workspace uses its dedicated embedded world', () => {
  assert.match(js, /v17-2-world-embedded\.html/);
  assert.doesNotMatch(world, /src=["']\.\/assets\/species-catalogue-v16\.js["']/);
});

test('standalone v16 retains its own catalogue', () => {
  assert.match(source, /species-catalogue-v16\.js/);
});

test('workspace preserves species identity in navigation', () => {
  assert.match(js, /searchParams\.set\(['"]species['"]/);
  assert.match(js, /guideURL/);
  assert.ok(records && typeof records === 'object');
});
