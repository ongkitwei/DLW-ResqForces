import React from "react";

function InputFieldDropDown({ label, option }) {
  return (
    <form className="max-w-sm mx-auto">
      <label
        htmlFor="countries"
        className="block mb-2 text-sm font-medium text-gray-900 "
      >
        {label}
      </label>
      <select
        id="countries"
        className=" border border-gray-300 text-sm rounded-lg focus:border-gray-500 block w-full p-2.5 placeholder-gray-400 text-gray-500 focus:ring-gray-500"
      >
        <option value={option}>{option}</option>
      </select>
    </form>
  );
}

export default InputFieldDropDown;
