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
import "../css/Cart.module.css";

export const Cart = () => {
  const [cartProducts, setCartProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const cartCollectionRef = collection(db, "Cart");
    const unsubscribe = onSnapshot(cartCollectionRef, (snapshot) => {
      setCartProducts(
        snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    });
    return unsubscribe;
  }, []);

  // Function to calculate total price
  const calculateTotalPrice = () => {
    return cartProducts.reduce(
      (total, product) => total + product.price * product.qty,
      0
    );
  };

  const increaseQty = async (product) => {
    const productRef = doc(db, "Cart", product.id);
    await updateDoc(productRef, {
      qty: increment(1),
      TotalProductPrice: increment(product.price),
    });
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
    <div className="cart-container">
      {cartProducts.length > 0 ? (
        <>
          <CartProducts
            cartProducts={cartProducts}
            increaseQty={increaseQty}
            decreaseQty={decreaseQty}
            removeProduct={removeProduct}
          />
          <div className="cart-total">
            <h3>Total Price: ${calculateTotalPrice().toFixed(2)}</h3>
            <button className="checkout-button" onClick={handleCheckout}>
              Checkout
            </button>
          </div>
        </>
      ) : (
        <div>No products in the cart.</div>
      )}
    </div>
  );
};
