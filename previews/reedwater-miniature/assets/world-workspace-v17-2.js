
import {
  validateCatalogue,
  searchSpecies,
  guideURL
} from './species-catalogue-v14.js';
import { useLocalGuide, publicGuideHtml } from './public-field-guide-v18.js';

const $ = id => document.getElementById(id);

const world = $('world-frame');
const guide = $('guide-frame');
const info = $('info');
const catalogue = $('catalogue');
const guidePanel = $('guide');
const search = $('search');
const results = $('results');

const params = new URL(location.href).searchParams;
const requestedId = params.get('species');

const guideBase =
  'http://localhost:8765/reedwater_field_guide_embedded_v1_9.html';

let records = [];
let selected = null;
let page = 0;
let mode = 'species';

const pageSize = 50;

const worldUrl = new URL('./v17-2-world-embedded.html', location.href);
if (requestedId) worldUrl.searchParams.set('species', requestedId);
world.src = worldUrl.href;

function selectSpecies(id) {
  if (!records.some(record => record.species_id === id)) return false;

  selected = id;

  const url = new URL(location.href);
  url.searchParams.set('species', id);
  history.replaceState(null, '', url);

  // Update catalogue identity only, not any provisional 3D model.
  try {
    const child = new URL(world.contentWindow.location.href);
    child.searchParams.set('species', id);
    world.contentWindow.history.replaceState(null, '', child);
  } catch {
    // The outer catalogue remains usable if iframe access is unavailable.
  }

  return true;
}

function render() {
  results.replaceChildren();

  const matches = searchSpecies(records, search.value);
  const pages = Math.max(1, Math.ceil(matches.length / pageSize));

  page = Math.min(page, pages - 1);

  $('count').textContent =
    `${matches.length} of ${records.length} species`;

  $('page-label').textContent = `Page ${page + 1} of ${pages}`;
  $('previous').disabled = page === 0;
  $('next').disabled = page >= pages - 1;

  const visible = matches.slice(page * pageSize, (page + 1) * pageSize);

  for (const record of visible) {
    const article = document.createElement('article');
    article.className = 'species';

    const name = document.createElement('strong');
    name.textContent = record.registry_name || 'Name unavailable';

    const details = document.createElement('small');
    details.textContent =
      `${record.species_id} · ${record.source_guild || 'Guild unknown'}`;

    const select = document.createElement('button');
    select.textContent =
      selected === record.species_id ? 'Selected' : 'Select';

    select.onclick = () => {
      selectSpecies(record.species_id);
      render();
    };

    const read = document.createElement('button');
    read.textContent = 'Read Field Guide';
    read.onclick = () => {
      selectSpecies(record.species_id);
      showMode('guide');
    };

    article.append(name, details, select, read);
    results.append(article);
  }
}

function showMode(nextMode) {
  if (nextMode === 'guide' && !selected) return;

  mode = nextMode;

  catalogue.hidden = mode !== 'species';
  guidePanel.hidden = mode !== 'guide';

  $('species-tab').setAttribute(
    'aria-selected', String(mode === 'species')
  );
  $('guide-tab').setAttribute(
    'aria-selected', String(mode === 'guide')
  );

  $('pages').hidden = mode !== 'species';

  if (mode === 'guide') {
    const record = records.find(item => item.species_id === selected);
    if (!record) return;
    if (useLocalGuide(location.hostname)) {
      const destination = guideURL(selected, guideBase);
      if (destination) {
        guide.removeAttribute('srcdoc');
        guide.src = destination;
      }
    } else {
      // Public visitors must not be sent to their own localhost.
      // This is catalogue detail only; it does not assign scene presence.
      guide.removeAttribute('src');
      guide.srcdoc = publicGuideHtml(record);
    }
  } else {
    guide.removeAttribute('src');
    guide.removeAttribute('srcdoc');
    render();
  }
}

function openInfo() {
  document.body.classList.remove('closed');
  document.body.classList.add('mobile-info');
  $('toggle').textContent = 'Hide information';
}

function closeInfo() {
  document.body.classList.add('closed');
  document.body.classList.remove('mobile-info');
  $('toggle').textContent = 'Show information';
}

$('species-tab').onclick = () => showMode('species');
$('guide-tab').onclick = () => showMode('guide');

$('toggle').onclick = () => {
  document.body.classList.contains('closed')
    ? openInfo()
    : closeInfo();
};

search.oninput = () => {
  page = 0;
  render();
};

$('previous').onclick = () => {
  if (page > 0) {
    page--;
    render();
    catalogue.scrollTop = 0;
  }
};

$('next').onclick = () => {
  page++;
  render();
  catalogue.scrollTop = 0;
};

// Preserve the 3D scene while hiding its legacy floating catalogue.
world.addEventListener('load', () => {
  try {
    const doc = world.contentDocument;
    const style = doc.createElement('style');
    style.textContent =
      '#aster-catalogue-open,#aster-catalogue{' +
      'display:none!important}';
    doc.head.append(style);
  } catch {
    console.warn('Legacy catalogue could not be hidden.');
  }
});

// Adjustable desktop information-panel width.
const divider = $('divider');
const workspace = $('workspace');
let dragging = false;

divider.addEventListener('pointerdown', event => {
  dragging = true;
  divider.setPointerCapture(event.pointerId);
});

divider.addEventListener('pointermove', event => {
  if (!dragging) return;

  const rect = workspace.getBoundingClientRect();
  const percent = Math.max(
    45,
    Math.min(75, (event.clientX - rect.left) / rect.width * 100)
  );

  workspace.style.gridTemplateColumns =
    `${percent}fr 8px ${100 - percent}fr`;
});

divider.addEventListener('pointerup', () => {
  dragging = false;
});

divider.addEventListener('pointercancel', () => {
  dragging = false;
});

async function initialise() {
  try {
    const response = await fetch(
      './data/reedwater_species_catalogue_v14.json'
    );
    if (!response.ok) throw Error(`HTTP ${response.status}`);

    records = validateCatalogue(await response.json());

    if (
      requestedId &&
      records.some(record => record.species_id === requestedId)
    ) {
      selected = requestedId;
      search.value = requestedId;
    }

    render();

    if (selected) showMode('guide');

  } catch (error) {
    $('count').textContent =
      `Catalogue unavailable: ${error.message}`;
  }
}

initialise();
