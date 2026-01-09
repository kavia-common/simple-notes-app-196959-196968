const STORAGE_KEY = "notes.v1";

/**
 * Stored structure:
 * {
 *   version: 1,
 *   data: { notes: Note[] }
 * }
 *
 * Note:
 * - Versioning allows migrations if schema changes later.
 */

function safeJsonParse(raw) {
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function migrateEnvelope(envelope) {
  // v1 is current schema.
  // Future migrations can be handled like:
  // if (envelope.version === 0) { ... return { version: 1, data: ... } }
  if (!envelope || typeof envelope !== "object") {
    return { version: 1, data: { notes: [] } };
  }

  if (envelope.version === 1 && envelope.data && Array.isArray(envelope.data.notes)) {
    return envelope;
  }

  // If envelope is malformed, reset safely.
  return { version: 1, data: { notes: [] } };
}

// PUBLIC_INTERFACE
export function loadNotesState() {
  /** Loads notes state from localStorage with basic migration/versioning. */
  const raw = window.localStorage.getItem(STORAGE_KEY);
  const parsed = safeJsonParse(raw);
  const migrated = migrateEnvelope(parsed);
  return migrated.data;
}

// PUBLIC_INTERFACE
export function saveNotesState(state) {
  /** Saves notes state to localStorage using a single key and versioned envelope. */
  const envelope = { version: 1, data: state };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(envelope));
}

// PUBLIC_INTERFACE
export function getStorageKey() {
  /** Returns the localStorage key used by this app. */
  return STORAGE_KEY;
}
