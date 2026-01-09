import React from "react";

// PUBLIC_INTERFACE
export default function Header({ query, onQueryChange, onNewNote }) {
  /** App header containing title, search input, and primary CTA. */
  return (
    <header className="Header">
      <div className="HeaderInner">
        <div className="Brand">
          <div className="BrandMark" aria-hidden="true">
            N
          </div>
          <div className="BrandText">
            <div className="BrandTitle">Notes</div>
            <div className="BrandSubtitle">Simple, fast, local.</div>
          </div>
        </div>

        <div className="HeaderActions">
          <label className="Search" aria-label="Search notes">
            <span className="SearchIcon" aria-hidden="true">
              ⌕
            </span>
            <input
              className="SearchInput"
              type="search"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="Search notes…"
            />
          </label>

          <button type="button" className="Button ButtonPrimary" onClick={onNewNote}>
            New note
          </button>
        </div>
      </div>
    </header>
  );
}
