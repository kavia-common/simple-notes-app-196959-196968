import React, { useMemo, useState } from "react";
import "./App.css";
import Header from "./components/Header";
import NotesList from "./components/NotesList";
import NoteModal from "./components/NoteModal";
import ConfirmDialog from "./components/ConfirmDialog";
import Toast from "./components/Toast";
import { NotesProvider, useNotes } from "./context/NotesContext";
import { matchesQuery, sortNotes } from "./utils/notes";
import { useDebouncedValue } from "./hooks/useDebouncedValue";

function AppShell() {
  const { state, actions, toast } = useNotes();

  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, 120);

  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [noteModalMode, setNoteModalMode] = useState("create"); // "create" | "edit"
  const [activeNote, setActiveNote] = useState(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);

  const visibleNotes = useMemo(() => {
    const filtered = state.notes.filter((n) => matchesQuery(n, debouncedQuery));
    return sortNotes(filtered);
  }, [state.notes, debouncedQuery]);

  const openCreate = () => {
    setActiveNote(null);
    setNoteModalMode("create");
    setNoteModalOpen(true);
  };

  const openEdit = (note) => {
    setActiveNote(note);
    setNoteModalMode("edit");
    setNoteModalOpen(true);
  };

  const requestDelete = (note) => {
    setNoteToDelete(note);
    setConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (noteToDelete?.id) actions.deleteNote(noteToDelete.id);
    setConfirmOpen(false);
    setNoteToDelete(null);
  };

  const cancelDelete = () => {
    setConfirmOpen(false);
    setNoteToDelete(null);
  };

  const onSaveModal = (payload) => {
    if (noteModalMode === "edit" && activeNote?.id) {
      actions.updateNote(activeNote.id, payload);
    } else {
      actions.createNote(payload);
    }
    setNoteModalOpen(false);
    setActiveNote(null);
  };

  const onTogglePin = (note) => {
    if (note?.id) actions.togglePin(note.id);
  };

  return (
    <div className="AppRoot">
      <Header query={query} onQueryChange={setQuery} onNewNote={openCreate} />

      <main className="Main">
        <div className="Toolbar" role="region" aria-label="Notes toolbar">
          <div className="ToolbarLeft">
            <div className="CountPill" aria-label={`${visibleNotes.length} notes`}>
              {visibleNotes.length} {visibleNotes.length === 1 ? "note" : "notes"}
            </div>
            {debouncedQuery?.trim() ? (
              <div className="FilterPill" aria-label="Active search filter">
                Filtering: “{debouncedQuery.trim()}”
              </div>
            ) : null}
          </div>

          <div className="ToolbarRight">
            <button type="button" className="Button ButtonPrimary" onClick={openCreate}>
              New note
            </button>
          </div>
        </div>

        <NotesList notes={visibleNotes} onEdit={openEdit} onDelete={requestDelete} onTogglePin={onTogglePin} />
      </main>

      <NoteModal
        isOpen={noteModalOpen}
        mode={noteModalMode}
        initialNote={activeNote}
        onClose={() => {
          setNoteModalOpen(false);
          setActiveNote(null);
        }}
        onSave={onSaveModal}
      />

      <ConfirmDialog
        isOpen={confirmOpen}
        title="Delete note?"
        description={
          noteToDelete
            ? `This will permanently delete “${noteToDelete.title}”. You can’t undo this action.`
            : "This will permanently delete the note. You can’t undo this action."
        }
        confirmText="Delete"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />

      <Toast toast={toast} />
    </div>
  );
}

// PUBLIC_INTERFACE
export default function App() {
  /** Application root: wires NotesProvider and renders the SPA. */
  return (
    <NotesProvider>
      <AppShell />
    </NotesProvider>
  );
}
