import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import VerifyEmail from "./pages/VerifyEmail";
import ResetPassword from "./pages/ResetPassword";
import { ToastContainer, toast } from "react-toastify";
import AddProduct from "./AddProduct";
import Wishlist from "./pages/Wishlist";
import Cart from "./pages/Cart";
import Shop from "./pages/Shop";
import ProductDetails from "./pages/ProductDetails";
import AboutUs from "./pages/aboutUs";
import ContactUs from "./pages/ContactUs";
import Checkout from "./pages/Checkout";

const App = () => {
  return (
    <div>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/verify-email" element={<VerifyEmail />}></Route>
        <Route path="/reset-password" element={<ResetPassword />}></Route>
        <Route path="/addProduct" element={<AddProduct />}></Route>
        <Route path="/wishlist" element={<Wishlist />}></Route>
        <Route path="/cart" element={<Cart />}></Route>
        <Route path="/shop" element={<Shop />}></Route>
        <Route path="/product/:identifier" element={<ProductDetails />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/checkout" element={<Checkout />} />
      </Routes>
    </div>
  );
};

export default App;
