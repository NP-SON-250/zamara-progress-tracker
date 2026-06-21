import React from "react";
const Welcome = ({ handleNew, handleExport, user, type }) => {
  return (
    <>
      <div className="flex justify-between md:px-5 py-2">
        <h3 className="md:text-xs text-xs text-zblue/60 font-semibold capitalize">
          Welcome, {user}
        </h3>
      </div>
    </>
  );
};

export default Welcome;
