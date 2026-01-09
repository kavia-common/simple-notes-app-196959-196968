import React, { useEffect, useMemo, useState } from "react";
import ModalBase from "./ModalBase";
import { createNoteDraft } from "../utils/notes";

function validate({ title }) {
  const errors = {};
  if (!title || !title.trim()) errors.title = "Title is required.";
  if (title && title.trim().length > 120) errors.title = "Title must be 120 characters or less.";
  return errors;
}

// PUBLIC_INTERFACE
export default function NoteModal({ isOpen, mode, initialNote, onClose, onSave }) {
  /** Modal form used for both creating and editing notes. */
  const isEdit = mode === "edit";

  const initial = useMemo(() => {
    if (isEdit && initialNote) {
      return { title: initialNote.title ?? "", content: initialNote.content ?? "", pinned: Boolean(initialNote.pinned) };
    }
    return createNoteDraft();
  }, [isEdit, initialNote]);

  const [form, setForm] = useState(initial);
  const [touched, setTouched] = useState({ title: false });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setForm(initial);
      setTouched({ title: false });
      setSubmitted(false);
    }
  }, [isOpen, initial]);

  const errors = validate(form);
  const showTitleError = (touched.title || submitted) && errors.title;

  const submitDisabled = Boolean(errors.title);

  const onSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    const currentErrors = validate(form);
    if (Object.keys(currentErrors).length) return;

    onSave({
      title: form.title,
      content: form.content,
      pinned: form.pinned
    });
  };

  const footer = (
    <>
      <button type="button" className="Button" onClick={onClose}>
        Cancel
      </button>
      <button type="submit" form="note-form" className="Button ButtonPrimary" disabled={submitDisabled}>
        {isEdit ? "Save changes" : "Create note"}
      </button>
    </>
  );

  return (
    <ModalBase
      title={isEdit ? "Edit note" : "New note"}
      isOpen={isOpen}
      onClose={onClose}
      footer={footer}
      ariaDescribedById="note-modal-desc"
    >
      <p id="note-modal-desc" className="SrOnly">
        {isEdit ? "Edit your note and save changes." : "Enter a title and optional content to create a note."}
      </p>

      <form id="note-form" className="Form" onSubmit={onSubmit}>
        <div className="Field">
          <label className="Label" htmlFor="note-title">
            Title <span className="Required">*</span>
          </label>
          <input
            id="note-title"
            className={`Input ${showTitleError ? "InputError" : ""}`}
            type="text"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            onBlur={() => setTouched((t) => ({ ...t, title: true }))}
            placeholder="e.g., Grocery list"
            maxLength={140}
            required
          />
          {showTitleError ? <div className="ErrorText">{errors.title}</div> : null}
        </div>

        <div className="Field">
          <label className="Label" htmlFor="note-content">
            Content
          </label>
          <textarea
            id="note-content"
            className="Textarea"
            rows={8}
            value={form.content}
            onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
            placeholder="Write your note…"
          />
        </div>

        <div className="Field Row">
          <label className="Checkbox">
            <input
              type="checkbox"
              checked={form.pinned}
              onChange={(e) => setForm((f) => ({ ...f, pinned: e.target.checked }))}
            />
            <span>Pin</span>
          </label>
        </div>
      </form>
    </ModalBase>
  );
}
