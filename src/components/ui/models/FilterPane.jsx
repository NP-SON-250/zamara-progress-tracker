import React, { useRef, useEffect } from "react";
import { X } from "lucide-react";

const FilterPane = ({
  filters,
  dynamicFilters,
  setDynamicFilters,
  visibleFields,
  availableFields,
  showFieldDropdown,
  setShowFieldDropdown,
  removeFilter,
  handleFieldSelect,
  hasActiveFilters,
  onClose,
}) => {
  const fieldDropdownRef = useRef(null);
  const filterButtonRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      const clickedDropdown =
        fieldDropdownRef.current &&
        fieldDropdownRef.current.contains(event.target);

      const clickedButton =
        filterButtonRef.current &&
        filterButtonRef.current.contains(event.target);

      if (!clickedDropdown && !clickedButton) {
        setShowFieldDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setShowFieldDropdown]);
  return (
    <div className="flex">
      <div className="w-full border-r p-4 bg-gray-50 max-h-32 overflow-y-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center pb-1 border-b">
          <h3 className="font-medium text-zblue">Views</h3>
          <X
            size={16}
            onClick={onClose}
            className="text-zblue cursor-pointer"
          />
        </div>

        {/* TITLE */}
        <div className="text-zgreen/60 font-medium pt-2">
          {hasActiveFilters ? "Filtering list by:" : "All"}
        </div>

        {/* EXISTING FILTERS */}
        {filters?.map((filter, index) => (
          <div key={index} className="mb-3">
            <label className="block text-sm text-gray-600 mb-1">
              {filter.label}
            </label>
            <select className="w-full border rounded px-2 py-1">
              {filter.options.map((opt, i) => (
                <option key={i}>{opt}</option>
              ))}
            </select>
          </div>
        ))}

        {/* DYNAMIC FILTERS */}
        {dynamicFilters.map((f, index) => (
          <div key={index} className="mb-3">
            {/* LABEL + REMOVE */}
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm text-gray-600">{f.field.label}</label>
              <X
                size={14}
                className="cursor-pointer text-gray-400"
                onClick={() => removeFilter(index)}
              />
            </div>

            {/* TEXT INPUT */}
            {(!f.field.type || f.field.type === "text") && (
              <input
                type="text"
                value={f.value}
                onChange={(e) => {
                  const updated = [...dynamicFilters];
                  updated[index].value = e.target.value;
                  setDynamicFilters(updated);
                }}
                className="w-full border rounded px-2 outline-none hover:border-zgreen"
              />
            )}

            {/* SELECT INPUT */}
            {f.field.type === "select" && (
              <select
                value={f.value}
                onChange={(e) => {
                  const updated = [...dynamicFilters];
                  updated[index].value = e.target.value;
                  setDynamicFilters(updated);
                }}
                className="w-full border rounded px-2 py-[3px] outline-none hover:border-zgreen"
              >
                <option value="" disabled hidden></option>
                {f.field.options?.map((opt, i) => (
                  <option key={i} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            )}

            {/* DATE INPUT */}
            {f.field.type === "date" && (
              <input
                type="date"
                value={f.value}
                onChange={(e) => {
                  const updated = [...dynamicFilters];
                  updated[index].value = e.target.value;
                  setDynamicFilters(updated);
                }}
                className="w-full border rounded px-2 py-[0.5px] outline-none hover:border-zgreen"
              />
            )}
          </div>
        ))}

        {/* ADD FILTER */}
        <div className="relative" ref={fieldDropdownRef}>
          <div
            className={`${hasActiveFilters ? "flex justify-between gap-2" : ""}`}
          >
            <button
              ref={filterButtonRef}
              onClick={() => setShowFieldDropdown((prev) => !prev)}
              className={`mt-2 py-[0.5px] flex items-center justify-center pl-1 border hover:border-zgreen rounded text-zblue font-semibold w-full
              } text-left`}
            >
              + Filter...
            </button>
          </div>

          {/* FIELD DROPDOWN */}
          {showFieldDropdown && (
            <div className="fixed top-[152px] w-64 bg-white border shadow-lg rounded-t z-20 max-h-[172px] overflow-y-auto">
              {/* VISIBLE FIELDS */}
              <div className="p-2">
                <div className="text-xs text-gray-400 mb-1">Visible Fields</div>
                {visibleFields.map((field, i) => (
                  <div
                    key={i}
                    onClick={() => handleFieldSelect(field)}
                    className="px-2 py-1 hover:bg-gray-100 cursor-pointer"
                  >
                    {field.label}
                  </div>
                ))}
              </div>

              <div className="border-t my-1" />

              {/* AVAILABLE FIELDS */}
              <div className="p-2">
                <div className="text-xs text-gray-400 mb-1">
                  Available Fields
                </div>
                {availableFields.map((field, i) => (
                  <div
                    key={i}
                    onClick={() => handleFieldSelect(field)}
                    className="px-2 py-1 hover:bg-gray-100 cursor-pointer"
                  >
                    {field.label}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterPane;
