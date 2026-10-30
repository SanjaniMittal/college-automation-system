import { X } from "lucide-react";

function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <h2>{title}</h2>

          <button
            type="button"
            className="modal-close"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Modal;