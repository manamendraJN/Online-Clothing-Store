import PropTypes from "prop-types";

function Input({ handleChange, value, ProductName, name, color }) {
  return (
    <label className="sidebar-label-container">
      <input onChange={handleChange} type="radio" value={value} name={name} />
      <span className="checkmark" style={{ backgroundColor: color }}></span>
      {ProductName}
    </label>
  );
}

// Corrected prop types
Input.propTypes = {
  handleChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired, // Ensured it's a string
  ProductName: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  color: PropTypes.string,
};

export default Input;
