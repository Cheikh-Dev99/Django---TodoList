import PropTypes from "prop-types";

export default function Alert({ show, message, type = "error" }) {
  if (!show) return null;

  const alertTypes = {
    error: "bg-red-500",
    success: "bg-green-500",
    warning: "bg-yellow-500",
    info: "bg-blue-500",
  };

  return (
    <div
      className={`w-full ${alertTypes[type]} text-white p-2 text-center mb-4 rounded`}
    >
      {message}
    </div>
  );
}

Alert.propTypes = {
  show: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(["error", "success", "warning", "info"]),
};
