import test from 'node:test';
import assert from 'node:assert/strict';
import {useLocalGuide, escapeHtml, publicGuideHtml} from '../assets/public-field-guide-v18.js';

test('local detailed guide is never requested on a public host', () => {
  for (const host of ['andrewmccarter-web.github.io', 'example.org', '192.168.1.2', '']) {
    assert.equal(useLocalGuide(host), false);
  }
  for (const host of ['localhost', '127.0.0.1', '::1']) {
    assert.equal(useLocalGuide(host), true);
  }
});
test('public guide escapes untrusted catalogue strings', () => {
  const html = publicGuideHtml({
    species_id: 'DTSP-001-0002',
    registry_name: '<img src=x onerror=alert(1)>',
    source_guild: 'flora & fauna',
    parent_lineage_id: '"quoted"'
  });
  assert.ok(!html.includes('<img'));
  assert.ok(html.includes('&lt;img'));
  assert.ok(html.includes('flora &amp; fauna'));
  assert.ok(html.includes('&quot;quoted&quot;'));
  assert.ok(html.includes('not a verified wildlife sighting'));
});
test('reject missing source identity', () => {
  assert.throws(() => publicGuideHtml(null));
  assert.throws(() => publicGuideHtml({registry_name:'No ID'}));
});
test('missing optional attributes are labelled unavailable', () => {
  const html = publicGuideHtml({species_id:'DTSP-001-0002'});
  assert.ok(html.includes('Registry name unavailable'));
  assert.ok(html.includes('Unspecified'));
  assert.ok(html.includes('Unavailable'));
});
