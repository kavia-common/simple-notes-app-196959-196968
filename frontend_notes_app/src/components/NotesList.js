import React from "react";
import NoteCard from "./NoteCard";

// PUBLIC_INTERFACE
export default function NotesList({ notes, onEdit, onDelete, onTogglePin }) {
  /** Displays notes in a responsive card grid with an empty state. */
  if (!notes.length) {
    return (
      <div className="EmptyState" role="status" aria-live="polite">
        <div className="EmptyIcon" aria-hidden="true">
          🗒
        </div>
        <div className="EmptyTitle">No notes found</div>
        <div className="EmptyText">Create a note or try a different search.</div>
      </div>
    );
  }

  return (
    <div className="NotesGrid" role="list">
      {notes.map((note) => (
        <NoteCard
          key={note.id}
          note={note}
          onEdit={() => onEdit(note)}
          onDelete={() => onDelete(note)}
          onTogglePin={() => onTogglePin(note)}
        />
      ))}
    </div>
  );
}
