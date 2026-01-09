import React from "react";
import ModalBase from "./ModalBase";

// PUBLIC_INTERFACE
export default function ConfirmDialog({ isOpen, title, description, confirmText, onConfirm, onCancel }) {
  /** Simple confirm dialog (used for deletes). */
  const footer = (
    <>
      <button type="button" className="Button" onClick={onCancel}>
        Cancel
      </button>
      <button type="button" className="Button ButtonDanger" onClick={onConfirm}>
        {confirmText || "Confirm"}
      </button>
    </>
  );

  return (
    <ModalBase title={title} isOpen={isOpen} onClose={onCancel} footer={footer} ariaDescribedById="confirm-desc">
      <p id="confirm-desc" className="ConfirmText">
        {description}
      </p>
    </ModalBase>
  );
}
