// src/pages/HomePage.js
import React, { useState } from "react";
import ProductList from "../components/ProductList";
import CartSidebar from "../components/CartSidebar";

const HomePage = ({ cart, setCart }) => {
  return (
    <div className="homepage">
      <div className="product-list">
        <h1>Product List</h1>
        <ProductList setCart={setCart} />
      </div>
      <div className="cart-sidebar-container">
        <CartSidebar cart={cart} />
      </div>
    </div>
  );
};

export default HomePage;
