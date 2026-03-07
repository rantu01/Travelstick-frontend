import React from "react";

const SelectionList = ({ options, onSelect }) => (
  <div className="flex flex-col w-60 max-h-64 overflow-y-auto bg-white rounded-md shadow-lg border border-gray-100">
    {options.map((opt, idx) => (
      <button
        key={idx}
        onClick={() => onSelect(opt)}
        className="text-left px-4 py-3 hover:bg-gray-50 text-sm font-semibold text-gray-700 border-b border-gray-50 last:border-none"
      >
        {opt}
      </button>
    ))}
  </div>
);

export default SelectionList;
