import { Inbox } from "lucide-react";

function EmptyState({
  title = "No Data Found",
  message = "There is nothing to display here yet.",
}) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <Inbox size={32} />
      </div>

      <h3>{title}</h3>

      <p>{message}</p>
    </div>
  );
}

export default EmptyState;