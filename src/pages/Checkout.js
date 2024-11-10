import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Checkout = ({ cart, setCart }) => {
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

  const totalAmount = cart.reduce(
    (total, item) =>
      total +
      (products.find((prod) => prod.id === item.id)?.price || 0) *
        item.quantity,
    0
  );

  const handlePayment = () => {
    alert("Payment successful!");
    setCart([]);
    navigate("/");
  };

  const handleCancel = () => {
    navigate("/");
  };

  return (
    <div className="checkout">
      <h2>Checkout</h2>
      <div className="checkout-items">
        {cart.map((item) => {
          const product = products.find((prod) => prod.id === item.id);
          return product ? (
            <div key={item.id} className="checkout-item">
              <img
                src={product.images[0]}
                alt={product.title}
                style={{ width: "100px", height: "auto" }}
              />
              <h3>{product.title}</h3>
              <p>Quantity: {item.quantity}</p>
              <p>Price per item: ${product.price.toFixed(2)}</p>
              <p>Total price: ${(product.price * item.quantity).toFixed(2)}</p>
            </div>
          ) : (
            <p key={item.id}>Product not found</p>
          );
        })}
      </div>
      <h3>Total Amount: ${totalAmount.toFixed(2)}</h3>
      <button onClick={handleCancel}>Cancel</button>
      <button onClick={handlePayment}>Pay</button>
    </div>
  );
};

export default Checkout;
