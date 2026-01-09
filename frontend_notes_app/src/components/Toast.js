import React from "react";

function toneClass(type) {
  switch (type) {
    case "success":
      return "ToastSuccess";
    case "info":
      return "ToastInfo";
    case "error":
      return "ToastError";
    default:
      return "ToastInfo";
  }
}

// PUBLIC_INTERFACE
export default function Toast({ toast }) {
  /** Snackbar-like toast message; auto-hidden by provider. */
  if (!toast) return null;

  return (
    <div className={`Toast ${toneClass(toast.type)}`} role="status" aria-live="polite">
      <div className="ToastMessage">{toast.message}</div>
    </div>
  );
}
