import PropTypes from "prop-types";
import { React} from "react";
import { Link } from 'react-router-dom';
import '../Products/Card.css'


function Card({ id,URL, ProductName, Brand,  Price }) {


  return (
    // <section className="card">
    //     <Link to={`/pview/${id}`} className="card-link">
    //     <img src={URL} alt={ProductName} className="card-img" />
    //     </Link>
    //   <div className="card-details">
    //     <h4 className="productname">{ProductName}</h4>
    //     <section className="brand">
    //       <div className="brand">{Brand}</div>
    //     </section>

    //       <div className="price">
    //         {Price}
    //       </div>
    //       <div className="bag">
    //        {/* <button className="addToCartBttn" onClick={() => addToCart(id)}>
    //           <p>Add To</p>
    //           <BsFillBagHeartFill className="bag-icon" />
    //           {cartItemCount > 0 && <> ({cartItemCount})</>}
    //         </button>*/}
    //       </div>
    //   </div>
    // </section>
    <section className="card">
      <Link to={`/pview/${id}`} className="card-link">
        <div className="card-img-container">
          <img src={URL} alt={ProductName} className="card-img" />
        </div>
      </Link>
      <div className="card-details">
        <h4 className="productname">{ProductName}</h4>
        <section className="brand">
          <div className="brand">{Brand}</div>
        </section>
        <div className="price">Rs. {Price}</div>
      </div>
    </section>
  );
}
//for eslint
Card.propTypes = {
  id: PropTypes.string.isRequired,
  URL: PropTypes.string.isRequired,
  ProductName: PropTypes.string.isRequired,
  Brand: PropTypes.string.isRequired,
  Price: PropTypes.string.isRequired,

};
export default Card;
