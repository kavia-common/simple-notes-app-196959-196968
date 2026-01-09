# Notes App (React, localStorage)

A simple, frontend-only notes app built with React. Notes are stored entirely in your browser using `localStorage`.

## Features

- Create, edit, delete notes
- Search notes by title/content
- Sorts by pinned first, then `updatedAt` (descending)
- Pin/unpin notes for quick access
- Modal form with validation
- Delete confirmation dialog
- Toast/snackbar feedback on save/delete/pin
- Responsive modern light theme UI

## localStorage persistence

- Single storage key: `notes.v1`
- Data is stored with a small versioned envelope for migration:

```json
{ "version": 1, "data": { "notes": [] } }
```

The app loads data on startup and saves on every change.

## Available scripts

In this project directory, you can run:

- `npm start` - run dev server on http://localhost:3000
- `npm run build` - build for production
- `npm test` - run tests (not required for this task)
