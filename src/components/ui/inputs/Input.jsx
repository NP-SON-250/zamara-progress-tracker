import React from "react";

const Input = ({
  label,
  type = "text",
  value,
  onChange,
  name,
  options,
  ...rest
}) => {
  return (
    <div className="mb-4 flex justify-between items-center gap-5 w-full">
      <label className="text-sm font-medium text-gray-700 w-[30%]">
        {label}
      </label>

      {/* Select Field */}
      {type === "select" ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          className="w-full border border-gray-400 rounded px-2 py-[5px] text-sm focus:outline-none focus:border-zgreen hover:border-zgreen"
        >
          {options?.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      ) : type === "toggle" ? (
        // Toggle Switch Field
        <div className="flex items-center gap-3">
          <label
            htmlFor={name}
            className="relative inline-block w-10 h-5 cursor-pointer"
          >
            <input
              type="checkbox"
              id={name}
              name={name}
              checked={value}
              onChange={(e) => onChange(e)}
              className="sr-only peer"
            />
            <div className="w-10 h-5 bg-gray-300 rounded-full peer-checked:bg-zgreen transition-colors duration-200"></div>
            <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-200 peer-checked:translate-x-5"></div>
          </label>
        </div>
      ) : (
        // Regular Input Field
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className="w-full border border-gray-400 rounded px-2 py-1 text-sm focus:outline-none focus:border-zgreen hover:border-zgreen"
          {...rest}
        />
      )}
    </div>
  );
};

export default Input;
