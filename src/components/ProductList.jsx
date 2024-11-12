import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/styles.css";

const ProductList = ({ cart, setCart }) => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(""); // State for the pop-up message
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://api.escuelajs.co/api/v1/products")
      .then((response) => response.json())
      .then((data) => {
        const filteredProducts = data.filter(
          (product) =>
            product.title &&
            product.price &&
            product.images &&
            product.images.length > 0
        );
        setProducts(filteredProducts);
        setLoading(false);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item.id === product.id);
      if (existingProduct) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
    showMessage(`${product.title} added to cart!`); // Show message when a product is added
  };

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => {
      setMessage(""); // Clear message after 3 seconds
    }, 3000);
  };

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="container">
      <div className="header">
        <h2>Product List</h2>
        <button className="view-cart-button" onClick={() => navigate("/cart")}>
          View Cart ({totalQuantity})
        </button>
      </div>
      <div className="search-cart-container">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>
      {loading ? (
        <p>Loading products...</p>
      ) : (
        <div className="product-items">
          {filteredProducts.map((product) => (
            <div key={product.id} className="product-card">
              <img src={product.images[0]} alt={product.title} />
              <h3>{product.title}</h3>
              <p className="product-price">${product.price}</p>
              <button onClick={() => addToCart(product)}>Add to Cart</button>
            </div>
          ))}
        </div>
      )}
      {message && <div className="popup-message">{message}</div>}{" "}
      {/* Render the message */}
    </div>
  );
};

export default ProductList;
