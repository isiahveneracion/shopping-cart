import React, { useEffect, useState } from "react";
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

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCart([]); // Clear the cart
    showMessage("All items removed from cart!"); // Show message when cart is cleared
  };

  const increaseQuantity = (id) => {
    setCart(
      cart.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQuantity = (id) => {
    setCart(
      cart.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const totalAmount = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="container">
      <div className="header">
        <h2>Product List</h2>
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
      <div className="main-content">
        <div className="product-items">
          {loading ? (
            <p>Loading products...</p>
          ) : (
            filteredProducts.map((product) => (
              <div key={product.id} className="product-card">
                <img src={product.images[0]} alt={product.title} />
                <h3>{product.title}</h3>
                <p className="product-price">${product.price}</p>
                <button onClick={() => addToCart(product)}>Add to Cart</button>
              </div>
            ))
          )}
        </div>
        {/* Cart Display */}
        <div className="cart">
          <h3>Your Cart</h3>
          {cart.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <div className="cart-items">
              {cart.map((item) => {
                const product = products.find((prod) => prod.id === item.id);
                return (
                  <div key={item.id} className="cart-item">
                    {product && (
                      <>
                        <img
                          src={product.images[0]}
                          alt={product.title}
                          style={{ width: "100px", height: "auto" }}
                        />
                        <h4>{product.title}</h4>
                        <div className="quantity-controls">
                          <button onClick={() => decreaseQuantity(item.id)}>
                            -
                          </button>
                          <span>{item.quantity}</span>
                          <button onClick={() => increaseQuantity(item.id)}>
                            +
                          </button>
                        </div>
                        <p>Price per item: ${product.price.toFixed(2)}</p>
                        <p>
                          Total price: $
                          {(product.price * item.quantity).toFixed(2)}
                        </p>
                        <button onClick={() => removeFromCart(item.id)}>
                          Remove
                        </button>
                      </>
                    )}
                  </div>
                );
              })}
              <h4>Total Amount: ${totalAmount.toFixed(2)}</h4>
              <button onClick={clearCart} className="remove-all-button">
                Remove All
              </button>
              <button onClick={() => navigate("/checkout")}>
                Proceed to Checkout
              </button>
            </div>
          )}
        </div>
      </div>
      {message && <div className="popup-message">{message}</div>}{" "}
      {/* Render the message */}
    </div>
  );
};

export default ProductList;
