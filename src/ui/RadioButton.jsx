import PropTypes from "prop-types";

export default function RadioButton({
  id,
  name,
  checked,
  onChange,
  label,
  className = "",
}) {
  return (
    <div className={`flex items-center ${className}`}>
      <input
        type="radio"
        id={id}
        name={name}
        checked={checked}
        onChange={onChange}
        className="m-1"
      />
      <label htmlFor={id} className="mr-5">
        {label}
      </label>
    </div>
  );
}

RadioButton.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  className: PropTypes.string,
};
