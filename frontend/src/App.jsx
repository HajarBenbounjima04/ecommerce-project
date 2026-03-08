import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import AboutUs from "./pages/aboutUs";
import ContactUs from "./pages/ContactUs";
import ResetPassword from "./pages/ResetPassword";
import Shop from "./pages/Shop";
import AddProduct from "./AddProduct";
import { ToastContainer } from "react-toastify";

const App = () => {
  return (
    <div>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/reset-password" element={<ResetPassword />}></Route>
        <Route path="/shop" element={<Shop />} />
        <Route path="/add-product" element={<AddProduct />} /> 
      </Routes>
    </div>
  );
};

export default App;
