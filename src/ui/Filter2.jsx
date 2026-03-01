import React from "react";

function Filter({ handleBedokFilter, handleDieppeFilter, handleAllData }) {
  return (
    <div className="filter pb-8 flex gap-1 items-center justify-center">
      <input
        className="btn filter-reset"
        type="radio"
        name="metaframeworks"
        aria-label="All"
      />
      <input
        className="btn bg-slate-100"
        type="radio"
        name="metaframeworks"
        aria-label="Bedok"
        onChange={handleBedokFilter}
      />
      <input
        className="btn bg-slate-100"
        type="radio"
        name="metaframeworks"
        aria-label="Dieppe"
        onChange={handleDieppeFilter}
      />
    </div>
  );
}

export default Filter;
