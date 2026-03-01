"use client";

import { Combobox } from "@headlessui/react";
import { useState } from "react";

export default function SearchableSelect({ value, onChange, options }) {
  const [query, setQuery] = useState("");

  const filteredOptions =
    query === ""
      ? options
      : options.filter((opt) =>
          opt.toLowerCase().includes(query.toLowerCase())
        );

  return (
    <div className="relative mb-4 mt-4">
      <Combobox value={value} onChange={onChange}>
        <Combobox.Input
          className="border border-gray-300 text-sm rounded-lg focus:border-gray-500 block w-full p-2.5 placeholder-gray-400 text-gray-500 focus:ring-gray-500"
          onChange={(event) => setQuery(event.target.value)}
          displayValue={(val) => val}
          placeholder="Reserve name"
        />
        <Combobox.Options className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-auto">
          {filteredOptions.map((opt, idx) => (
            <Combobox.Option
              key={idx}
              value={opt}
              className="p-2 cursor-pointer hover:bg-gray-100"
            >
              {opt}
            </Combobox.Option>
          ))}
        </Combobox.Options>
      </Combobox>
    </div>
  );
}
