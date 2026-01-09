import React from "react";
import { formatShortDate } from "../utils/notes";

function excerpt(text, max = 160) {
  const t = (text ?? "").trim();
  if (!t) return "";
  if (t.length <= max) return t;
  return `${t.slice(0, max).trim()}…`;
}

// PUBLIC_INTERFACE
export default function NoteCard({ note, onEdit, onDelete, onTogglePin }) {
  /** Card representation of a note with quick actions. */
  const updated = formatShortDate(note.updatedAt);
  const created = formatShortDate(note.createdAt);
  const subtitle = updated ? `Updated ${updated}` : created ? `Created ${created}` : "";

  return (
    <article className="NoteCard" role="listitem">
      <div className="NoteCardTop">
        <h3 className="NoteTitle" title={note.title}>
          {note.title}
        </h3>

        <button
          type="button"
          className={`IconButton ${note.pinned ? "IconButtonActive" : ""}`}
          onClick={onTogglePin}
          aria-label={note.pinned ? "Unpin note" : "Pin note"}
          title={note.pinned ? "Pinned" : "Pin"}
        >
          {note.pinned ? "★" : "☆"}
        </button>
      </div>

      {note.content ? <p className="NoteBody">{excerpt(note.content)}</p> : <p className="NoteBodyMuted">No content</p>}

      <div className="NoteMeta">
        <span className="NoteTime">{subtitle}</span>

        <div className="NoteActions">
          <button type="button" className="Button ButtonGhost" onClick={onEdit}>
            Edit
          </button>
          <button type="button" className="Button ButtonDangerGhost" onClick={onDelete}>
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}
