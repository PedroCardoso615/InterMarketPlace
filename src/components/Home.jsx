import React, { useState, useEffect } from "react";
import { collection, getDocs, doc, setDoc, increment } from "firebase/firestore";
import { db } from "../firebase"; 
import { useNavigate } from "react-router-dom"; 
import Banner from "../images/Banner.png";
import styles from "../css/Home.module.css";

export const Home = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const productsArray = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(productsArray.slice(0, 4)); // Limit to 4 products
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const addToCart = async (product) => {
    const cartDocRef = doc(db, "Cart", product.id);

    try {
      await setDoc(
        cartDocRef,
        {
          ...product,
          qty: increment(1),
          TotalProductPrice: increment(product.price),
        },
        { merge: true }
      );
      setConfirmationMessage("Added to cart successfully!");
      setIsSuccess(true);

      setTimeout(() => {
        setConfirmationMessage("");
        setIsSuccess(false);
      }, 3000);
    } catch (error) {
      setConfirmationMessage("Error adding to the cart.");
      setIsSuccess(false);

      setTimeout(() => {
        setConfirmationMessage("");
        setIsSuccess(false);
      }, 3000);
    }
  };

  const handleBrowseAll = () => {
    navigate("/catalog"); // Redirect to the catalog page
  };

  return (
    <div>
      <div className={styles.banner_container}>
        <img className={styles.banner} src={Banner} alt="Banner" />
      </div>
      <h2 className={styles.products_heading}>Our Products</h2>
      {confirmationMessage && (
        <div
          className={styles.success_btn}
          style={{
            backgroundColor: isSuccess ? "#4CAF50" : "#f44336",
          }}
        >
          {confirmationMessage}
        </div>
      )}
      <div className={styles.catalog_container}>
        {products.map((product) => (
          <div key={product.id} className={styles.product_card}>
            <img src={product.imageUrl} alt={product.name} />
            <h1>{product.name}</h1>
            <p>{product.description}</p>
            <p>{product.price}€</p>
            <button onClick={() => addToCart(product)}>Add to Cart</button>
          </div>
        ))}
      </div>

      <div className={styles.btn_container}>
        <button 
          onClick={handleBrowseAll}
        >
          Browse All Products
        </button>
      </div>
    </div>
  );
};