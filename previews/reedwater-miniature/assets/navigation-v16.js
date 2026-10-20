// ASTER v16 — navigation configuration.
// No public Field Guide deployment has been verified.

const LOCAL_GUIDE =
  'http://localhost:8765/reedwater_field_guide_v1_4.html';

export function resolveFieldGuideBase(viewerUrl) {
  const url = new URL(viewerUrl);

  const localHost = ['localhost', '127.0.0.1', '[::1]']
    .includes(url.hostname);

  if (localHost && url.port === '8766' &&
      url.protocol === 'http:') {
    return LOCAL_GUIDE;
  }

  // Public/private catalogue deployment not established.
  return null;
}

export function navigationAvailability(viewerUrl) {
  const guide = resolveFieldGuideBase(viewerUrl);
  return {
    localDevelopment: guide !== null,
    fieldGuideAvailable: guide !== null,
    guideBase: guide
  };
}
