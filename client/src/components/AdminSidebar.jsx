import { Link } from "react-router-dom";

const AdminSidebar = () => {
  return (
    <div className="w-64 h-screen bg-red-900 text-white p-5 z-10">
       <h2 className="text-3xl font-bold mb-4">Trendora</h2>
       <hr/>
      <nav>
        <ul>
        <li className="mb-2">
            <Link to="/admin-product" className="block p-3 text-lg font-semibold hover:bg-red-600 rounded">
              Dashbord
            </Link>
          </li>
          <li className="mb-2">
            <Link to="/plist" className="block p-3 text-lg font-semibold hover:bg-red-600 rounded">
              Product List
            </Link>
          </li>
          <li>
            <Link to="/add" className="block p-3 text-lg font-semibold hover:bg-red-600 rounded">
              Add Products
            </Link>
          </li>
          <li>
            <Link to="/payments" className="block p-3 text-lg font-semibold hover:bg-red-600 rounded">
              Payment Transactions
            </Link>
          </li>
        </ul>
      </nav>  
      </div>
    
   
  );
};

export default AdminSidebar;