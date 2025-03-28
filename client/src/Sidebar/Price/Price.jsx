import PropTypes from "prop-types";
import "./Price.css";
import Input from "../../components/input.jsx";

function Price({ handleChg }) {
  return (
    <div className="ml">
      <h2 className="sidebar-title price-title">Price</h2>
      <label className="sidebar-label-container">
        <input onChange={handleChg} type="radio" value="" name="test2" />
        <span className="checkmark"></span>All
      </label>

      <Input handleChange={handleChg} value="500" ProductName="0-500" name="test2" />
      <Input handleChange={handleChg} value="1500" ProductName="500-1500" name="test2" />
      <Input handleChange={handleChg} value="2999" ProductName="1000-3000" name="test2" />
      <Input handleChange={handleChg} value="3000" ProductName="Over 3000" name="test2" />
    </div>
  );
}

// ESLint prop validation
Price.propTypes = {
  handleChg: PropTypes.func.isRequired,
};

export default Price;
