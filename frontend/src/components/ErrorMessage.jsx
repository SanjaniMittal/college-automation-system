import { AlertCircle } from "lucide-react";

function ErrorMessage({
  title = "Something went wrong",
  message = "Unable to load the requested information.",
  onRetry,
}) {
  return (
    <div className="error-message">
      <div className="error-message-icon">
        <AlertCircle size={28} />
      </div>

      <div className="error-message-content">
        <h3>{title}</h3>
        <p>{message}</p>

        {onRetry && (
          <button
            type="button"
            className="retry-button"
            onClick={onRetry}
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}

export default ErrorMessage;