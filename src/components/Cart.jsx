import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  doc,
  onSnapshot,
  updateDoc,
  deleteDoc,
  increment,
} from "firebase/firestore";
import { CartProducts } from "./CartProducts";
import { useNavigate } from "react-router-dom";
import styles from "../css/Cart.module.css";

export const Cart = () => {
  const [cartProducts, setCartProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const cartCollectionRef = collection(db, "Cart");
    const unsubscribe = onSnapshot(cartCollectionRef, (snapshot) => {
      const products = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCartProducts(products);
    });
    return unsubscribe;
  }, []);

  // Function to calculate total price
  const calculateTotalPrice = () => {
    return cartProducts.reduce((total, product) => {
      const price = Number(product.price) || 0;
      const qty = Number(product.qty) || 0;
      return total + price * qty;
    }, 0);
  };

  const increaseQty = async (product) => {
    try {
      const productRef = doc(db, "Cart", product.id);
      await updateDoc(productRef, {
        qty: increment(1),
        TotalProductPrice: increment(product.price),
      });
    } catch (error) {
      console.error("Failed to increase quantity:", error);
    }
  };

  const decreaseQty = async (product) => {
    if (product.qty > 1) {
      const productRef = doc(db, "Cart", product.id);
      await updateDoc(productRef, {
        qty: increment(-1),
        TotalProductPrice: increment(-product.price),
      });
    } else {
      removeProduct(product.id);
    }
  };

  const removeProduct = async (id) => {
    const productRef = doc(db, "Cart", id);
    await deleteDoc(productRef);
  };

  const handleCheckout = () => {
    navigate("/Checkout"); // Redirect to Checkout
  };

  return (
    <div className={styles.cart_container}>
      {cartProducts.length > 0 ? (
        <>
          <CartProducts
            cartProducts={cartProducts}
            increaseQty={increaseQty}
            decreaseQty={decreaseQty}
            removeProduct={removeProduct}
          />
          <div className={styles.cart_total}>
            <h3>Total Price: ${calculateTotalPrice().toFixed(2)}</h3>
            <button className={styles.checkout_btn} onClick={handleCheckout}>
              Checkout
            </button>
          </div>
        </>
      ) : (
        <div className={styles.empty_cart}>
          <p>Your cart is empty. Start shopping!</p>
          <button onClick={() => navigate("/catalog")}>Shop Now</button>
        </div>
      )}
    </div>
  );
};
