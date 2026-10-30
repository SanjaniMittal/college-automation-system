import { useEffect, useState } from "react";
import {
  Bell,
  CalendarDays,
  GraduationCap,
  Megaphone,
} from "lucide-react";

import DashboardLayout from "../../layouts/DashboardLayout";
import PageHeader from "../../components/PageHeader";
import { API_BASE_URL } from "../../config";

function Notices() {
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/notices`);

        if (!response.ok) {
          throw new Error("Failed to fetch notices");
        }

        const data = await response.json();

        const publishedNotices = data.filter(
          (notice) => notice.status === "Published"
        );

        setNotices(publishedNotices);
      } catch (error) {
        console.error("Error fetching notices:", error);
      }
    };

    fetchNotices();
  }, []);

  return (
    <DashboardLayout role="faculty">
      <PageHeader
        title="College Notices"
        description="Stay updated with the latest college announcements."
      />

      <div className="notice-page-list">
        {notices.map((notice) => {
          const Icon =
            notice.category === "Academic"
              ? GraduationCap
              : notice.category === "Examination"
              ? GraduationCap
              : notice.category === "Holiday"
              ? CalendarDays
              : notice.category === "Event"
              ? Megaphone
              : Bell;

          return (
            <div className="notice-page-card" key={notice._id}>
              <div className="notice-page-icon">
                <Icon size={21} />
              </div>

              <div className="notice-page-content">
                <div className="notice-page-top">
                  <span className="notice-category">
                    {notice.category}
                  </span>

                  <span className="notice-date">
                    {new Date(notice.date).toLocaleDateString(
                      "en-GB",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }
                    )}
                  </span>
                </div>

                <h2>{notice.title}</h2>

                <p>
                  {notice.content ||
                    `This is a ${notice.category.toLowerCase()} notice for ${notice.audience.toLowerCase()}.`}
                </p>

                <div style={{ marginTop: "12px", display: "flex", gap: "10px" }}>
                  <span style={{ fontSize: "0.78rem", color: "#64748b" }}>
                    Audience: <strong>{notice.audience}</strong>
                  </span>
                  {notice.author && (
                    <span style={{ fontSize: "0.78rem", color: "#64748b" }}>
                      Issued by: <strong>{notice.author}</strong>
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {notices.length === 0 && (
          <div className="admin-empty-state">
            No published notices available.
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default Notices;