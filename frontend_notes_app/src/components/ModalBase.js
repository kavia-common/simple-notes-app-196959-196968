import React, { useEffect, useRef } from "react";

// PUBLIC_INTERFACE
export default function ModalBase({ title, isOpen, onClose, children, footer, ariaDescribedById }) {
  /** Accessible modal base: closes on backdrop click or ESC; focuses first focusable element. */
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };

    window.addEventListener("keydown", onKeyDown);

    // Focus first focusable element inside dialog
    window.setTimeout(() => {
      const root = dialogRef.current;
      if (!root) return;
      const focusable = root.querySelector(
        'button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable && typeof focusable.focus === "function") focusable.focus();
    }, 0);

    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const onBackdropMouseDown = (e) => {
    if (e.target === e.currentTarget) onClose?.();
  };

  return (
    <div className="ModalOverlay" role="presentation" onMouseDown={onBackdropMouseDown}>
      <div
        className="Modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby={ariaDescribedById}
        ref={dialogRef}
      >
        <div className="ModalHeader">
          <h2 id="modal-title" className="ModalTitle">
            {title}
          </h2>
          <button type="button" className="IconButton" onClick={onClose} aria-label="Close dialog">
            ×
          </button>
        </div>
        <div className="ModalBody">{children}</div>
        {footer ? <div className="ModalFooter">{footer}</div> : null}
      </div>
    </div>
  );
}
