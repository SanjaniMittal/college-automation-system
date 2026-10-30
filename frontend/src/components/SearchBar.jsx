import { Search, X } from "lucide-react";

function SearchBar({ value, onChange, placeholder = "Search..." }) {
  return (
    <div className="search-bar">
      <Search size={18} className="search-bar-icon" />

      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
      />

      {value && (
        <button
          type="button"
          className="search-clear"
          onClick={() => onChange("")}
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}

export default SearchBar;