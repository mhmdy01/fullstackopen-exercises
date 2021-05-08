import React from "react";

const FilterPersons = ({ keyword, handleKeywordChange }) => {
  return (
    <div>
      search:{" "}
      <input
        value={keyword}
        onChange={handleKeywordChange}
        placeholder="type a name"
      />
    </div>
  );
};

export default FilterPersons;
