import React from "react";
import { BiBeenHere } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import styles from "../css/OrderCompleted.module.css"

export const OrderComplete = () => {
  const navigate = useNavigate();

  const handleRedirect = async (event) => {
    event.preventDefault();
    navigate("/"); // Redirect to home
  };

  return (
    <div className={styles.container}>
      <div className={styles.icon}>
        <BiBeenHere />
      </div>
      <h2 className={styles.order_mnsg}>Your Order is Completed!</h2>
      <button onClick={handleRedirect} className={styles.return_btn}>Go to HomePage</button>
    </div>
  );
};
