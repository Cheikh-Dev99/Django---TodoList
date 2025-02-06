import PropTypes from "prop-types";

export default function SectionTitle({ children, className = "" }) {
  return (
    <h3 className={`text-xl font-semibold mb-4 ${className}`}>{children}</h3>
  );
}

SectionTitle.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};
