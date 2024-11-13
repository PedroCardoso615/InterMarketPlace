import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../css/Checkout.module.css";

export const Checkout = () => {
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    alert("Payment Successful");
    navigate("/"); // Redirect to home
  };

  return (
    <div className={styles.checkout_container}>
      <h2>Checkout</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.input_group}>
          <label htmlFor={"cardNumber"}>Credit Card Number</label>
          <input type="text" id="cardNumber" required />
        </div>
        <div className={styles.input_group}>
          <label htmlFor="expiryDate">Expiry Date</label>
          <input type="text" id="expiryDate" required />
        </div>
        <div className={styles.input_group}>
          <label htmlFor="cvv">CVV</label>
          <input type="text" id="cvv" required />
        </div>
        <button className={styles.checkout_btn} type="submit">
          Pay Now
        </button>
      </form>
    </div>
  );
};
