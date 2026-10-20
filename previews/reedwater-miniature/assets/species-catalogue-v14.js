
// ASTER v14. Catalogue presence is NOT physical scene placement.
// No model-to-species assignment occurs in this module.

export function validateCatalogue(data) {
  if (!data || !Array.isArray(data.species)) {
    throw Error('Invalid ASTER catalogue structure');
  }
  if (data.species.length !== 437 ||
      data.species_count !== 437) {
    throw Error('Unexpected Reedwater species count');
  }
  if (data.scene_policy?.physical_placement_authorised !== false) {
    throw Error('Physical placement must remain unauthorised');
  }
  const ids = new Set();
  for (const record of data.species) {
    if (typeof record.species_id !== 'string' ||
        !record.species_id.trim() ||
        /[\x00-\x1f\x7f]/.test(record.species_id))
      throw Error('Invalid species ID');
    if (ids.has(record.species_id))
      throw Error('Duplicate species ID');
    ids.add(record.species_id);
    if (record.physical_scene_placement_verified !== false ||
        record.co_occurrence_verified !== false)
      throw Error('Unexpected physical-placement evidence');
  }
  validSpeciesIds.clear();
  for (const id of ids) validSpeciesIds.add(id);
  return data.species;
}

export function searchSpecies(records, query) {
  const term = String(query ?? '').trim().toLowerCase();
  if (!term) return records;
  return records.filter(record =>
    [record.species_id, record.registry_name,
     record.common_name, record.source_guild]
      .some(value => String(value ?? '').toLowerCase().includes(term))
  );
}

// Valid IDs are established by the imported G51 catalogue,
// not by an invented naming convention.
const validSpeciesIds = new Set();

export function guideURL(id, base) {
  if (typeof id !== 'string' || !id.trim() ||
      /[\x00-\x1f\x7f]/.test(id)) return null;
  if (!validSpeciesIds.has(id)) return null;
  const url = new URL(base);
  url.searchParams.set('species', id);
  return url.href;
}

async function initialise() {
  const style = document.createElement('style');
  style.textContent = `
    #aster-catalogue-open{
      position:fixed;right:15px;bottom:82px;z-index:100;
      padding:12px 16px;border:1px solid #c6ad75;
      border-radius:10px;background:#253b43;color:#f3e5c5;
      font:600 14px system-ui;cursor:pointer
    }
    #aster-catalogue{
      position:fixed;right:12px;top:12px;bottom:12px;
      z-index:110;width:min(450px,calc(100vw - 24px));
      box-sizing:border-box;overflow:hidden;
      display:flex;flex-direction:column;
      padding:16px;border:1px solid #c6ad75;
      border-radius:12px;background:#14272f;color:#f4ead8;
      box-shadow:0 12px 35px #0008;
      font:14px/1.5 system-ui
    }
    #aster-catalogue[hidden]{display:none}
    #aster-catalogue h2{margin:0;font-size:21px}
    #aster-catalogue p{margin:6px 0 12px;font-size:12px}
    #aster-catalogue input{
      box-sizing:border-box;width:100%;padding:11px;
      margin-bottom:9px;border-radius:7px;
      border:1px solid #8d9da0;background:#f8f3e9;
      color:#172830;font:14px system-ui
    }
    #aster-catalogue-results{overflow:auto;min-height:0;flex:1}
    .aster-species{
      padding:11px 3px;border-bottom:1px solid #52646a
    }
    .aster-species strong{display:block;font-size:14px}
    .aster-species small{display:block;color:#c5d0d0}
    .aster-species a{color:#e6cb89}
    #aster-catalogue-close{
      padding:7px 11px;margin-left:auto;cursor:pointer
    }
  `;
  document.head.append(style);

  const open = document.createElement('button');
  open.id = 'aster-catalogue-open';
  open.type = 'button';
  open.textContent = 'Species catalogue';

  const panel = document.createElement('aside');
  panel.id = 'aster-catalogue';
  panel.hidden = true;
  panel.setAttribute('aria-label', 'ASTER Reedwater species catalogue');

  const header = document.createElement('div');
  header.style.display = 'flex';
  header.style.alignItems = 'center';

  const title = document.createElement('h2');
  title.textContent = 'Reedwater species';

  const close = document.createElement('button');
  close.id = 'aster-catalogue-close';
  close.type = 'button';
  close.textContent = 'Close';

  header.append(title, close);

  const explanation = document.createElement('p');
  explanation.textContent =
    '437 source-linked catalogue records. Island association ' +
    'does not verify physical placement, co-occurrence, ' +
    'or correspondence to the 3D plants.';

  const search = document.createElement('input');
  search.type = 'search';
  search.placeholder = 'Search name, ID or guild';
  search.setAttribute('aria-label', 'Search species');

  const count = document.createElement('p');
  count.setAttribute('aria-live', 'polite');

  const results = document.createElement('div');
  results.id = 'aster-catalogue-results';

  const navigation = document.createElement('div');
  navigation.style.cssText =
    'display:flex;align-items:center;justify-content:space-between;' +
    'gap:8px;margin-top:10px';

  const previous = document.createElement('button');
  previous.type = 'button';
  previous.textContent = 'Previous';

  const pageInfo = document.createElement('span');
  pageInfo.style.fontSize = '12px';

  const next = document.createElement('button');
  next.type = 'button';
  next.textContent = 'Next';

  navigation.append(previous, pageInfo, next);
  panel.append(header, explanation, search, count, results, navigation);

  const pageSize = 50;
  let page = 0;
  document.body.append(open, panel);

  let records = [];
  let loadError = null;
  let previousFocus = null;

  const guideBase =
    'http://localhost:8765/reedwater_field_guide_v1_3.html';

  function render() {
    results.replaceChildren();
    if (loadError) {
      count.textContent = 'Catalogue unavailable';
      const message = document.createElement('p');
      message.textContent = loadError;
      results.append(message);
      return;
    }

    const matches = searchSpecies(records, search.value);
    const pages = Math.max(1, Math.ceil(matches.length / pageSize));
    page = Math.min(page, pages - 1);

    const start = page * pageSize;
    const visible = matches.slice(start, start + pageSize);

    count.textContent =
      `${matches.length} of ${records.length} species`;

    pageInfo.textContent = `Page ${page + 1} of ${pages}`;
    previous.disabled = page === 0;
    next.disabled = page >= pages - 1;

    for (const record of visible) {
      const article = document.createElement('article');
      article.className = 'aster-species';

      const name = document.createElement('strong');
      name.textContent =
        record.registry_name || 'Registry name unavailable';

      const meta = document.createElement('small');
      meta.textContent =
        `${record.species_id} · ${record.source_guild || 'Guild unspecified'}`;

      const note = document.createElement('small');
      note.textContent =
        'Registry record · 3D representation and physical placement unverified';

      const link = document.createElement('a');
      link.textContent = 'View Field Guide record';
      link.href = guideURL(record.species_id, guideBase);
      link.target = '_blank';
      link.rel = 'noopener noreferrer';

      article.append(name, meta, note, link);
      results.append(article);
    }


  }

  function dismiss() {
    panel.hidden = true;
    open.hidden = false;
    previousFocus?.focus();
  }

  open.addEventListener('click', () => {
    previousFocus = document.activeElement;
    panel.hidden = false;
    open.hidden = true;
    render();
    search.focus();
  });
  close.addEventListener('click', dismiss);
  panel.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      event.stopPropagation();
      dismiss();
    }
  });
  search.addEventListener('input', () => {
    page = 0;
    render();
  });

  previous.addEventListener('click', () => {
    if (page > 0) {
      page--;
      render();
      results.scrollTop = 0;
    }
  });

  next.addEventListener('click', () => {
    page++;
    render();
    results.scrollTop = 0;
  });

  try {
    const response = await fetch('./data/reedwater_species_catalogue_v14.json');
    if (!response.ok) throw Error(`HTTP ${response.status}`);
    records = validateCatalogue(await response.json());
  } catch (error) {
    loadError = `Unable to load source-linked catalogue: ${error.message}`;
  }
  if (!panel.hidden) render();
}

if (typeof document !== 'undefined') initialise();
