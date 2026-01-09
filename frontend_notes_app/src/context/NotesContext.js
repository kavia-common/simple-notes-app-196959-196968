import React, { createContext, useContext, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { loadNotesState, saveNotesState } from "../utils/storage";
import { createNewNote, updateExistingNote } from "../utils/notes";

const NotesContext = createContext(null);

const initialState = { notes: [] };

function reducer(state, action) {
  switch (action.type) {
    case "INIT":
      return { ...state, notes: action.payload.notes ?? [] };

    case "ADD_NOTE": {
      return { ...state, notes: [action.payload.note, ...state.notes] };
    }

    case "UPDATE_NOTE": {
      const updated = action.payload.note;
      return {
        ...state,
        notes: state.notes.map((n) => (n.id === updated.id ? updated : n))
      };
    }

    case "DELETE_NOTE": {
      const id = action.payload.id;
      return { ...state, notes: state.notes.filter((n) => n.id !== id) };
    }

    case "TOGGLE_PIN": {
      const id = action.payload.id;
      return {
        ...state,
        notes: state.notes.map((n) =>
          n.id === id ? { ...n, pinned: !n.pinned, updatedAt: new Date().toISOString() } : n
        )
      };
    }

    default:
      return state;
  }
}

function useToastQueue() {
  const [toast, setToast] = useState(null);
  const timerRef = useRef(null);

  const showToast = (next) => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    setToast(next);
    timerRef.current = window.setTimeout(() => setToast(null), 2500);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  return { toast, showToast };
}

// PUBLIC_INTERFACE
export function NotesProvider({ children }) {
  /** Provides notes state/actions backed by localStorage persistence. */
  const [state, dispatch] = useReducer(reducer, initialState);
  const { toast, showToast } = useToastQueue();

  // Load once on mount
  useEffect(() => {
    const loaded = loadNotesState();
    dispatch({ type: "INIT", payload: loaded });
  }, []);

  // Persist on every state change
  useEffect(() => {
    saveNotesState(state);
  }, [state]);

  // Actions
  const actions = useMemo(() => {
    return {
      // PUBLIC_INTERFACE
      createNote({ title, content, pinned }) {
        /** Creates a new note (optimistic; local-only). */
        const note = createNewNote({ title, content, pinned });
        dispatch({ type: "ADD_NOTE", payload: { note } });
        showToast({ type: "success", message: "Note saved." });
        return note;
      },

      // PUBLIC_INTERFACE
      updateNote(id, { title, content, pinned }) {
        /** Updates an existing note by id. */
        const existing = state.notes.find((n) => n.id === id);
        if (!existing) return null;
        const note = updateExistingNote(existing, { title, content, pinned });
        dispatch({ type: "UPDATE_NOTE", payload: { note } });
        showToast({ type: "success", message: "Note updated." });
        return note;
      },

      // PUBLIC_INTERFACE
      deleteNote(id) {
        /** Deletes a note by id. */
        dispatch({ type: "DELETE_NOTE", payload: { id } });
        showToast({ type: "info", message: "Note deleted." });
      },

      // PUBLIC_INTERFACE
      togglePin(id) {
        /** Toggles pinned status and bumps updatedAt. */
        dispatch({ type: "TOGGLE_PIN", payload: { id } });
        showToast({ type: "info", message: "Pin updated." });
      }
    };
  }, [state.notes, showToast]);

  const value = useMemo(() => ({ state, actions, toast }), [state, actions, toast]);

  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>;
}

// PUBLIC_INTERFACE
export function useNotes() {
  /** Hook to access notes state/actions. */
  const ctx = useContext(NotesContext);
  if (!ctx) throw new Error("useNotes must be used within a NotesProvider");
  return ctx;
}
