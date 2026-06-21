const Button = ({
  type = "button",
  color = "zblue",
  size = "md",
  onClick,
  children,
  className = "",
}) => {
  const base = "flex items-center gap-1 px-2 py-[2px] rounded text-sm ";
  const colorClasses = {
    zblue:
      "hover:bg-zblue/10 text-zblue/60 border border-zblue/60 hover:text-zblue",
    zgreen: "bg-zgreen hover:bg-zgreen/80 text-white",
    white: "bg-white hover:bg-gray-100 text-gray-700 border border-gray-300",
    outline: "border border-zblue text-zblue hover:bg-zblue hover:text-white",
  };

  const sizeClasses = {
    sm: "px-2 py-[2px] text-xs",
    md: "px-3 py-[2px] text-sm",
    lg: "px-4 py-[2px] text-base",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`rounded-md flex items-center gap-1 font-medium transition-colors ${colorClasses[color] || colorClasses.zblue} ${sizeClasses[size] || sizeClasses.md} ${className}`}
    >
      {children}
    </button>
  );
};
export default Button;
