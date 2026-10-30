function StatCard({ title, value, icon, description }) {
  return (
    <div className="stat-card">
      <div className="stat-card-top">
        <div className="stat-card-icon">
          {icon}
        </div>
      </div>

      <div className="stat-card-content">
        <p>{title}</p>
        <h3>{value}</h3>

        {description && (
          <span>{description}</span>
        )}
      </div>
    </div>
  );
}

export default StatCard;