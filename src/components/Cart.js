import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Cart = ({ cart, setCart }) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

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
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
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

  return (
    <div className="cart">
      <h2>Your Cart</h2>
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
                    <h3>{product.title}</h3>
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
                      Total price: ${(product.price * item.quantity).toFixed(2)}
                    </p>
                    <button onClick={() => removeFromCart(item.id)}>
                      Remove
                    </button>
                  </>
                )}
              </div>
            );
          })}
          <h3>Total Amount: ${totalAmount.toFixed(2)}</h3>
          <button onClick={() => navigate("/checkout")}>
            Proceed to Checkout
          </button>
        </div>
      )}
      <button onClick={() => navigate("/")}>Back to Product List</button>
    </div>
  );
};

export default Cart;
