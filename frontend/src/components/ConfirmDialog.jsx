import { AlertTriangle, X } from "lucide-react";

function ConfirmDialog({
  isOpen,
  title = "Confirm Action",
  message = "Are you sure you want to continue?",
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div
        className="confirm-dialog"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="modal-close"
          onClick={onCancel}
        >
          <X size={20} />
        </button>

        <div className="confirm-icon">
          <AlertTriangle size={28} />
        </div>

        <h2>{title}</h2>

        <p>{message}</p>

        <div className="confirm-actions">
          <button
            type="button"
            className="cancel-button"
            onClick={onCancel}
          >
            {cancelText}
          </button>

          <button
            type="button"
            className="confirm-button"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;