import PropTypes from "prop-types";
import "./Products.css";

function Products({ result }) {
  return <section className="card-container">{result}</section>;
}
//for eslint
Products.propTypes = {
  result: PropTypes.array.isRequired,
};
export default Products;
