/* Utility helpers for notes domain */

function nowIso() {
  return new Date().toISOString();
}

function randomId() {
  // Enough uniqueness for a local-only app.
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

// PUBLIC_INTERFACE
export function createNoteDraft() {
  /** Returns an empty draft note payload for the modal form. */
  return { title: "", content: "", pinned: false };
}

// PUBLIC_INTERFACE
export function createNewNote({ title, content, pinned }) {
  /** Creates a new Note object with required fields/timestamps. */
  const ts = nowIso();
  return {
    id: randomId(),
    title: title.trim(),
    content: content ?? "",
    pinned: Boolean(pinned),
    createdAt: ts,
    updatedAt: ts
  };
}

// PUBLIC_INTERFACE
export function updateExistingNote(note, { title, content, pinned }) {
  /** Returns an updated note preserving createdAt but bumping updatedAt. */
  return {
    ...note,
    title: title.trim(),
    content: content ?? "",
    pinned: Boolean(pinned),
    updatedAt: nowIso()
  };
}

// PUBLIC_INTERFACE
export function matchesQuery(note, query) {
  /** Returns true if note matches query in title/content (case-insensitive). */
  const q = (query ?? "").trim().toLowerCase();
  if (!q) return true;
  const title = (note.title ?? "").toLowerCase();
  const content = (note.content ?? "").toLowerCase();
  return title.includes(q) || content.includes(q);
}

// PUBLIC_INTERFACE
export function sortNotes(notes) {
  /**
   * Sorts notes with pinned first, then by updatedAt desc.
   * If updatedAt missing, falls back to createdAt.
   */
  const copy = [...notes];
  copy.sort((a, b) => {
    const ap = a.pinned ? 1 : 0;
    const bp = b.pinned ? 1 : 0;
    if (ap !== bp) return bp - ap;

    const at = Date.parse(a.updatedAt || a.createdAt || 0);
    const bt = Date.parse(b.updatedAt || b.createdAt || 0);
    return bt - at;
  });
  return copy;
}

// PUBLIC_INTERFACE
export function formatShortDate(iso) {
  /** Formats an ISO timestamp into a short, readable string. */
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
}
