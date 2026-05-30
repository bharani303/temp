import { Routes, Route } from "react-router-dom";
import Layout from "../layout/Layout";
import AdminRoute from "./AdminRoute";

import Home from "../pages/home";
import CategoryPage from "../pages/categories/CategoryPage";
import ProductDetails from "../pages/ProductDetails";
import Cart from "../pages/cart";
import About from "../pages/about";
import Contact from "../pages/contact";
import Career from "../pages/careers";
import CheckoutAddress from "../pages/CheckoutAddress";
import Orders from "../Components/ProfileComponents/orders";
import Profile from "../Components/ProfileComponents/Profile";
import Wishlist from "../Components/ProfileComponents/Wishlist";
import ProductPage from "../pages/ProductDetails";

import AdminProducts from "../Components/AdminComponents/AdminProducts";
import AdminUsers from "../Components/AdminComponents/AdminUsers";
import AdminOrders from "../Components/AdminComponents/AdminOrders";
import AdminProfile from "../Components/AdminComponents/AdminProfile";
import AdminDashboard from "../Components/AdminComponents/AdminDashboard";



const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<Layout />}>

        <Route path="/" element={<Home />} />

        {/* this is - Only dynamic category page */}
        <Route path="/category/:name" element={<CategoryPage />} />

        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />

        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/careers" element={<Career />} />
<Route path="/checkout" element={<CheckoutAddress />} />
<Route path="/orders" element={<Orders />} />
<Route path="/profile" element={<Profile />} />
<Route path="/wishlist" element={<Wishlist/>} />
<Route path="/ProductDetails/:id" element={<ProductPage/>} />

<Route
  path="/admin"
  element={
    <AdminRoute>
      <AdminDashboard/>
    </AdminRoute>
  }
>
  <Route path="/admin/products" element={<AdminProducts />} />
  <Route path="/admin/orders" element={<AdminOrders />} />
  <Route path="/admin/users" element={<AdminUsers />} />
  <Route path="/admin/profile" element={<AdminProfile />} />
</Route>

      </Route>
    </Routes>
  );
};

export default AppRoutes;