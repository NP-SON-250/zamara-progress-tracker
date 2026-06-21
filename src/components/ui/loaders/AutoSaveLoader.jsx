import React from "react";

const AutoSaveLoader = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="w-4 h-4 border-2 border-zblue border-t-zgreen rounded-full animate-spin"></div>
      <span className="text-md text-zblue">Saving...</span>
    </div>
  );
};

export default AutoSaveLoader;
