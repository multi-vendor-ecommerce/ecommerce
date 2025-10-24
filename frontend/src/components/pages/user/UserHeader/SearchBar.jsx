import { FaSearch } from "react-icons/fa";
import { FaTimes } from "react-icons/fa"; 
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";

function SearchBar({ mobile }) {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  return (
    <div
      className={`${mobile ? "flex w-full" : "hidden lg:flex flex-1 max-w-xl"
        } relative`}
    >
      <input
        type="text"
        placeholder="Search products here..."
        className="w-full px-3 py-2 border border-[#2E7D32] bg-white rounded-l-md 
                   focus:outline-none focus:border-green-700 focus:ring-2 focus:ring-green-300
                   hover:border-green-600 transition-all text-user-dark pr-8"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleKeyDown}
      />

      {searchTerm && (
        <button
          type="button"
          onClick={clearSearch}
          className="absolute right-12 top-1/2 -translate-y-1/2 text-gray-500 hover:text-green-500 transition-colors"
        >
          <FaTimes />
        </button>
      )}

      <button
        type="button"
        onClick={handleSearch}
        className="bg-[#2E7D32] px-3 text-white font-semibold rounded-r-md hover:bg-green-800 transition-colors"
      >
        <FaSearch />
      </button>
    </div>
  );
}

export default SearchBar;
