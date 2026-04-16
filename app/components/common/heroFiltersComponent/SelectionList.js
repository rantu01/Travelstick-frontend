import React from "react";
import { countries } from "countries-list";

const findCountryCode = (name) => {
  if (!name) return null;
  const candidate = String(name).split(",").pop().trim().toLowerCase();
  for (const [code, country] of Object.entries(countries)) {
    if (!country || !country.name) continue;
    const cName = country.name.toLowerCase();
    if (cName === candidate) return code.toLowerCase();
    if (cName.includes(candidate) || candidate.includes(cName)) return code.toLowerCase();
  }
  return null;
};

const SelectionList = ({ options, onSelect }) => (
  <div className="flex flex-col w-60 max-h-64 overflow-y-auto bg-white rounded-md shadow-lg border border-gray-100">
    {options.map((opt, idx) => {
      const isObj = opt && typeof opt === "object" && (opt.label || opt.value);
      const label = isObj ? opt.label : opt;
      const value = isObj ? (opt.value ?? opt.label) : opt;
      const countryCode = findCountryCode(label && typeof label === "string" ? label : String(label).replace(/<[^>]+>/g, ""));

      return (
        <button
          key={idx}
          type="button"
          onPointerDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onSelect(value);
          }}
          className="text-left px-4 py-3 hover:bg-gray-50 text-sm font-semibold text-gray-700 border-b border-gray-50 last:border-none flex items-center gap-3"
        >
          {countryCode ? (
            <img
              src={`https://flagcdn.com/w20/${countryCode}.png`}
              alt={String(label)}
              width={20}
              height={14}
              className="object-contain rounded-sm flex-shrink-0"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          ) : (
            <span className="w-5" />
          )}
          <span className="truncate">{label}</span>
        </button>
      );
    })}
  </div>
);

export default SelectionList;
