// InforCard.jsx
import React from "react";

const colorMap = {
  blue: "bg-blue-100/20 border-blue-900/50 text-blue-900",
};

const iconColorMap = {
  blue: "text-blue-900/60",
};

const InforCard = ({ title, value, icon, color = "blue", subtitle }) => {
  return (
    <div
      className={`border rounded-lg p-4 ${colorMap[color] || colorMap.blue}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium opacity-75">{title}</p>
          <p className="text-xl font-bold mt-1 text-blue-900/70">{value}</p>
          {subtitle && <p className="text-xs opacity-75 mt-1">{subtitle}</p>}
        </div>
        {icon && (
          <div
            className={`text-xl ${iconColorMap[color] || iconColorMap.blue}`}
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

export default InforCard;
