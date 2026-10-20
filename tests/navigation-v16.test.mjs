import test from 'node:test';
import assert from 'node:assert/strict';
import {
  resolveFieldGuideBase,
  navigationAvailability
} from '../previews/reedwater-miniature/assets/navigation-v16.js';

test('local viewer resolves existing Field Guide v1.4', () => {
  assert.equal(
    resolveFieldGuideBase(
      'http://localhost:8766/previews/reedwater-miniature/v16-desktop.html'
    ),
    'http://localhost:8765/reedwater_field_guide_v1_4.html'
  );
});

test('local address with another port does not resolve', () => {
  assert.equal(
    resolveFieldGuideBase('http://localhost:9999/viewer.html'),
    null
  );
});

test('published viewer has no invented Field Guide destination', () => {
  const url =
    'https://andrewmccarter-web.github.io/aster-world-console/' +
    'previews/reedwater-miniature/v16-desktop.html';
  assert.equal(resolveFieldGuideBase(url), null);
  assert.equal(navigationAvailability(url).fieldGuideAvailable, false);
});

test('unknown hosts do not navigate to private local services', () => {
  assert.equal(
    resolveFieldGuideBase('https://example.com/viewer.html'),
    null
  );
});

test('species selection remains separate from navigation', () => {
  assert.equal(
    navigationAvailability('http://localhost:8766/viewer.html')
      .fieldGuideAvailable,
    true
  );
});
