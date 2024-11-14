import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { getDocs, collection, deleteDoc } from "firebase/firestore";
import styles from "../css/Checkout.module.css";

export const Checkout = () => {
  const navigate = useNavigate();
  const [expiryDate, setExpiryDate] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    alert("Payment Successful");
    await clearCart();
    navigate("/order"); // Redirect to home
  };

  const clearCart = async () => {
    const cartCollectionRef = collection(db, "Cart");
    const cartDocs = await getDocs(cartCollectionRef);
    cartDocs.forEach((doc) => deleteDoc(doc.ref));
  }

  const validateExpiryDate = (date) => {
    const today = new Date();
    const selectedDate = new Date(date);
    return selectedDate >= today;
  };

  return (
    <div className={styles.checkout_container}>
      <h2>Checkout</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.input_group}>
          <label htmlFor="cardNumber">Credit Card Number</label>
          <input
            type="text"
            id="cardNumber"
            pattern="^\d{16}$"
            maxLength="16"
            minLength="16"
            required
            title="Credit card number must be 16 digits"
          />
        </div>
        <div className={styles.input_group}>
          <label htmlFor="expiryDate">Expiry Date</label>
          <input
            type="month"
            id="expiryDate"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            onBlur={(e) => {
              if (!validateExpiryDate(e.target.value)) {
                alert("Please enter a valid expiry date.");
                setExpiryDate("");
              }
            }}
            required
          />
        </div>
        <div className={styles.input_group}>
          <label htmlFor="cvv">CVV</label>
          <input
            type="text"
            id="cvv"
            pattern="^\d{3}$"
            maxLength="3"
            minLength="3"
            required
            title="CVV must be 3 digits"
          />
        </div>
        <button className={styles.checkout_btn} type="submit">
          Pay Now
        </button>
      </form>
    </div>
  );
};

