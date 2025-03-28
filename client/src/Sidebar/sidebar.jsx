import Category from "./Category/Category.jsx";
import Price from "./Price/Price.jsx";
import Colors from "./Colors/Colors.jsx";
import "./sidebar.css";
function sidebar({ handleChange }) {
  return (
    <section className="sidebar">
      <div className="logo-container">
      </div>
      <Category handleChg={handleChange} />
      <Price handleChg={handleChange} />
      <Colors handleChg={handleChange} />
    </section>
  );
}
export default sidebar;
