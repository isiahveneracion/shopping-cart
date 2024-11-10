// src/App.js
import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ProductList from "./components/ProductList";
import Cart from "./components/Cart";
import Checkout from "./pages/Checkout";
import "./styles/styles.css";

const App = () => {
  const [cart, setCart] = useState([]);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<ProductList cart={cart} setCart={setCart} />}
        />
        <Route path="/cart" element={<Cart cart={cart} setCart={setCart} />} />
        <Route
          path="/checkout"
          element={<Checkout cart={cart} setCart={setCart} />}
        />
      </Routes>
    </Router>
  );
};

export default App;
