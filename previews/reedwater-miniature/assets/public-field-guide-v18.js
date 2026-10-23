// ASTER public preview: source-linked catalogue detail, not a canonical field guide.
// No network calls, model/species bindings or scene placement are performed here.
export function useLocalGuide(hostname) {
  return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1';
}

export function escapeHtml(value) {
  return String(value ?? 'Unavailable').replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);
}

export function publicGuideHtml(record) {
  if (!record || typeof record.species_id !== 'string' || !record.species_id) {
    throw new Error('Source-linked species record required');
  }
  const name = escapeHtml(record.registry_name || 'Registry name unavailable');
  const id = escapeHtml(record.species_id);
  const guild = escapeHtml(record.source_guild || 'Unspecified');
  const lineage = escapeHtml(record.parent_lineage_id || 'Unavailable');
  return `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>ASTER catalogue detail</title><style>
body{margin:0;padding:24px;font:16px/1.6 system-ui;background:#f6efe1;color:#253b43}
main{max-width:720px;margin:auto}h1{font-size:1.65rem;line-height:1.25}
dt{font-weight:700;margin-top:12px}dd{margin:0}
.notice{border-left:4px solid #8d7451;padding:10px 14px;background:#eee3cd}
small{color:#475d61}</style></head><body><main>
<p><small>ASTER / REEDWATER · READ-ONLY CATALOGUE</small></p>
<h1>${name}</h1>
<dl><dt>Species registry ID</dt><dd>${id}</dd>
<dt>Source guild</dt><dd>${guild}</dd>
<dt>Parent lineage ID</dt><dd>${lineage}</dd></dl>
<p class="notice"><strong>Source-linked record, not a verified wildlife sighting.</strong>
This catalogue entry does not establish the species' physical location,
co-occurrence, anatomy or correspondence to any 3D model.
The registry name is not a verified native endonym.</p>
<p>The detailed local Field Guide is not part of this public preview.
No connection to a visitor's local computer is required.</p>
</main></body></html>`;
}
