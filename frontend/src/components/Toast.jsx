import { CheckCircle, XCircle, X } from "lucide-react";

function Toast({
  message,
  type = "success",
  onClose,
}) {
  if (!message) {
    return null;
  }

  const isSuccess = type === "success";

  return (
    <div className={`toast toast-${type}`}>
      <div className="toast-icon">
        {isSuccess ? (
          <CheckCircle size={20} />
        ) : (
          <XCircle size={20} />
        )}
      </div>

      <p>{message}</p>

      <button
        type="button"
        className="toast-close"
        onClick={onClose}
      >
        <X size={17} />
      </button>
    </div>
  );
}

export default Toast;