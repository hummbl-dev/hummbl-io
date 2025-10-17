// Data loader utility - bridges build outputs to React app

/**
 * Loads data from build output directory or API endpoints
 * Supports both static JSON files and dynamic API calls
 */

const BUILD_OUTPUT_DIR = (import.meta.env?.VITE_BUILD_OUTPUT_DIR as string) || '/data';
const USE_STATIC_DATA = (import.meta.env?.VITE_USE_STATIC_DATA as string) !== 'false'; // Default to true

export async function loadNarratives() {
  if (USE_STATIC_DATA) {
    const response = await fetch(`${BUILD_OUTPUT_DIR}/narratives.json`);
    if (!response.ok) throw new Error(`Failed to load narratives: ${response.status}`);
    return response.json();
  }
  // Fallback to API
  const response = await fetch('/api/narratives');
  if (!response.ok) throw new Error('Failed to fetch narratives from API');
  return response.json();
}

export async function loadNetwork() {
  if (USE_STATIC_DATA) {
    const response = await fetch(`${BUILD_OUTPUT_DIR}/network.json`);
    if (!response.ok) throw new Error('Failed to load network data');
    return response.json();
  }
  const response = await fetch('/api/network');
  if (!response.ok) throw new Error('Failed to fetch network from API');
  return response.json();
}

export async function loadQDM() {
  if (USE_STATIC_DATA) {
    const response = await fetch(`${BUILD_OUTPUT_DIR}/qdm.json`);
    if (!response.ok) throw new Error('Failed to load QDM data');
    return response.json();
  }
  const response = await fetch('/api/qdm');
  if (!response.ok) throw new Error('Failed to fetch QDM from API');
  return response.json();
}

export async function loadLedger() {
  if (USE_STATIC_DATA) {
    const response = await fetch(`${BUILD_OUTPUT_DIR}/ledger.json`);
    if (!response.ok) throw new Error('Failed to load ledger data');
    return response.json();
  }
  const response = await fetch('/api/ledger');
  if (!response.ok) throw new Error('Failed to fetch ledger from API');
  return response.json();
}

export async function loadSITREP() {
  if (USE_STATIC_DATA) {
    const response = await fetch(`${BUILD_OUTPUT_DIR}/sitrep.json`);
    if (!response.ok) throw new Error('Failed to load SITREP data');
    return response.json();
  }
  const response = await fetch('/api/sitrep');
  if (!response.ok) throw new Error('Failed to fetch SITREP from API');
  return response.json();
}
