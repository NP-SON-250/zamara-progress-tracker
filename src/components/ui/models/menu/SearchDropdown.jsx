import React, { useEffect, useRef } from "react";
import { LuMinimize2, LuMaximize2 } from "react-icons/lu";
import { MdOutlineClose } from "react-icons/md";
const SearchDropdown = ({ isOpen, onClose, topbarHeight = 45 }) => {
  const dropdownRef = useRef(null);

  // ---------------- Close when clicking outside ----------------
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center">
      {/* Dropdown Container */}
      <div
        ref={dropdownRef}
        style={{
          top: `${topbarHeight}px`,
        }}
        className="relative w-[100%] md:w-[70%] lg:w-[60%] bg-white rounded-md shadow-2xl pt-1 pb-2 px-3 animate-fadeIn"
      >
        {/* Top Actions */}
        <div className="flex justify-end gap-4 text-gray-500">
          <LuMaximize2 className="cursor-pointer hover:text-black mr-14" />
          <div
            className="absolute top-0 right-0 bg-zblue text-white hover:bg-zgreen/60  px-2 rounded-bl-lg cursor-pointer"
            onClick={onClose}
          >
            <MdOutlineClose size={18} />
          </div>
        </div>

        {/* Search Title */}
        <p className="text-blue-900/50 mb-3 text-sm">
          Tell us what you want to do
        </p>

        {/* Search Input */}
        <input
          type="text"
          className="w-full border border-gray-400 rounded px-2 py-1 text-sm outline-none hover:border-zgreen"
        />

        {/* Description */}
        <p className="mt-4 text-sm text-blue-900/50">
          You Can{" "}
          <span className="hover:text-zgreen/60 text-zblue/70 cursor-pointer">exploring pages</span>{" "}
          or{" "}
          <span className="hover:text-zgreen/60 text-zblue/70 cursor-pointer">
            exploring reports
          </span>
        </p>
      </div>
    </div>
  );
};

export default SearchDropdown;
