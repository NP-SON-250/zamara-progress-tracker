import React, { useEffect, useRef } from "react";
import { MdOutlineClose } from "react-icons/md";

const SystemSettings = ({ isOpen, onClose, topbarHeight = 45 }) => {
  const panelRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />

      {/* Sliding Panel */}
      <div
        ref={panelRef}
        style={{
          top: `${topbarHeight}px`,
          height: `calc(100vh - ${topbarHeight}px)`,
        }}
        className={`fixed right-0 md:w-[90%] w-full bg-white z-50 shadow-2xl transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center py-1 px-6 md:border-b border-b-2 border-zblue/30">
          <h2 className="text-md text-blue-900/50 font-semibold">System Settings</h2>
          <div
            className="absolute top-0 right-0 bg-zblue text-white hover:bg-zgreen/60  px-2 rounded-bl-lg cursor-pointer"
            onClick={onClose}
          >
            <MdOutlineClose size={18} />
          </div>
        </div>

        {/* Content */}
        <div className="text-center pt-2 text-blue-900/50">Nothing new right now.</div>
      </div>
    </>
  );
};

export default SystemSettings;
