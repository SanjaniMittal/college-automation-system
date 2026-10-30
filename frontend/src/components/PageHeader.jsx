function PageHeader({
  title,
  description,
  action,
  actionLabel = "Add New",
}) {
  return (
    <div className="page-header">
      <div>
        <h1>{title}</h1>

        {description && <p>{description}</p>}
      </div>

      {action && (
        <button
          type="button"
          className="page-header-action"
          onClick={action}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export default PageHeader;