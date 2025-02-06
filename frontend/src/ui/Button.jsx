import PropTypes from "prop-types";

const Button = ({
  children,
  onClick,
  variant = "primary",
  className = "",
  rounded = false,
}) => {
  const baseClasses = "px-2 py-1 text-sm flex items-center gap-2";
  const variants = {
    primary: "bg-blue-500 hover:bg-blue-600 text-white",
    danger: "bg-red-500 hover:bg-red-600 text-white",
    success: "bg-green-500 hover:bg-green-600 text-white",
    info: "bg-sky-500 hover:bg-sky-600 text-white",
    secondary:
      "bg-gray-500 hover:bg-gray-600 text-white border border-gray-600",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        ${baseClasses} 
        ${variants[variant]} 
        ${rounded ? "rounded-full" : "rounded-lg"}
        ${className}
      `}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
  variant: PropTypes.oneOf([
    "primary",
    "danger",
    "success",
    "info",
    "secondary",
  ]),
  className: PropTypes.string,
  rounded: PropTypes.bool,
};

export default Button;
