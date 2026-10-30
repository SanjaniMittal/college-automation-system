function DataTable({
  columns = [],
  data = [],
  emptyMessage = "No records found.",
}) {
  return (
    <div className="data-table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{column.label}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length || 1}
                className="data-table-empty"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr key={row.id || row._id || rowIndex}>
                {columns.map((column) => (
                  <td key={column.key}>
                    {column.render
                      ? column.render(row)
                      : row[column.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;