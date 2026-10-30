import { useEffect, useState } from "react";
import { BookOpen, Users, Clock } from "lucide-react";

import DashboardLayout from "../../layouts/DashboardLayout";
import PageHeader from "../../components/PageHeader";
import { API_BASE_URL } from "../../config";

function Classes() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/courses`);

        if (!response.ok) {
          throw new Error("Failed to fetch courses");
        }

        const data = await response.json();

        setClasses(data);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setError("Unable to load your classes.");
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  return (
    <DashboardLayout role="faculty">
      <PageHeader
        title="My Classes"
        description="View and manage your assigned classes."
      />

      {loading && (
        <div className="content-card">
          <p>Loading classes...</p>
        </div>
      )}

      {error && !loading && (
        <div className="content-card">
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && classes.length === 0 && (
        <div className="content-card">
          <p>No classes available.</p>
        </div>
      )}

      {!loading && !error && classes.length > 0 && (
        <div className="faculty-class-grid">
          {classes.map((item) => (
            <div
              className="content-card faculty-class-card"
              key={item._id}
            >
              <div className="faculty-class-card-top">
                <div className="faculty-class-icon">
                  <BookOpen size={22} />
                </div>

                <div>
                  <h2>{item.name}</h2>
                  <p>
                    {item.code} • {item.department}
                  </p>
                </div>
              </div>

              <div className="faculty-class-meta">
                <div>
                  <Users size={17} />
                  <span>
                    Semester {item.semester}
                  </span>
                </div>

                <div>
                  <Clock size={17} />
                  <span>
                    {item.credits} Credits
                  </span>
                </div>
              </div>

              <div className="faculty-class-room">
                Faculty: {item.faculty}
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}

export default Classes;