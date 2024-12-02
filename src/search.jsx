
import React from 'react';

function Search({ searchQuery, setSearchQuery, handleSearch }) {
  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Search items"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
}

export default Search;
