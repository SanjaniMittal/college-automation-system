import { Bell, CalendarDays } from "lucide-react";

function NoticeCard({ title, description, date, type = "General" }) {
  return (
    <div className="notice-card">
      <div className="notice-icon">
        <Bell size={20} />
      </div>

      <div className="notice-content">
        <div className="notice-top">
          <span className="notice-type">{type}</span>

          {date && (
            <span className="notice-date">
              <CalendarDays size={14} />
              {date}
            </span>
          )}
        </div>

        <h3>{title}</h3>

        {description && <p>{description}</p>}
      </div>
    </div>
  );
}

export default NoticeCard;