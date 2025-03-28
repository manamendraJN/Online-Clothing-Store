import PropTypes from "prop-types";
function Buttons({ onClickhandler, value, ProductName }) {
  return (
    <button onClick={onClickhandler} value={value} className="btns">
      {ProductName}
    </button>
  );
}
//for eslint
Buttons.propTypes = {
  onClickhandler: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  ProductName: PropTypes.string.isRequired,
};
export default Buttons;
