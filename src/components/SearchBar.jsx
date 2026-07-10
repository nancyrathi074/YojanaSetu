import { FaSearch } from "react-icons/fa";

function SearchBar({ search, setSearch }) {
  return (
    <div className="input-group mb-4">

      <span className="input-group-text bg-white">

        <FaSearch />

      </span>

      <input
        type="text"
        className="form-control"
        placeholder="Search schemes by name or category..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

    </div>
  );
}

export default SearchBar;