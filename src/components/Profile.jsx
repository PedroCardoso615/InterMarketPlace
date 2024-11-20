import React, { useEffect, useState } from "react";
import { auth } from "../firebase";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { signOut, onAuthStateChanged, updatePassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import styles from "../css/Profile.module.css";

const db = getFirestore();

export const Profile = () => {
  const [userIn, setUserIn] = useState(null);
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [userProducts, setUserProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [loginProvider, setLoginProvider] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    let unsubscribe;

    const fetchUserData = async () => {
      setLoading(true);

      unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        if (currentUser) {
          setUserIn(currentUser);

          const provider = currentUser.providerData[0]?.providerId || "";
          setLoginProvider(provider);

          try {
            const docRef = doc(db, "users", currentUser.uid);
            const userDoc = await getDoc(docRef);

            if (userDoc.exists()) {
              setNewUsername(userDoc.data().username || "");
            }

            const productsQuery = query(
              collection(db, "products"),
              where("userId", "==", currentUser.uid)
            );
            const productsSnapshot = await getDocs(productsQuery);
            const productsList = productsSnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setUserProducts(productsList);
          } catch (err) {
            console.error("Failed fetching user data:", err);
            setError("Failed to load user data");
          }
        } else {
          navigate("/login");
        }
        setLoading(false);
      });
    };
    fetchUserData();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (err) {
      setError("Failed to log out.");
      console.error(err);
    }
  };

  const handleUsernameChange = async (e) => {
    e.preventDefault();
    if (userIn && newUsername !== userIn.username) {
      try {
        const docRef = doc(db, "users", userIn.uid);
        await updateDoc(docRef, { username: newUsername });

        setConfirmationMessage("Username updated successfully!");
        setIsSuccess(true);

        setTimeout(() => {
          setConfirmationMessage("");
          setIsSuccess(false);
        }, 3000);
      } catch (err) {
        setError("Failed to update username");
        console.error(err);
      }
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword.length >= 7) {
      try {
        await updatePassword(auth.currentUser, newPassword);
        setConfirmationMessage("Passaword updated successfully!");
        setIsSuccess(true);

        setTimeout(() => {
          setConfirmationMessage("");
          setIsSuccess(false);
        }, 3000);
      } catch (err) {
        setError("Failed to update password");
      }
    } else {
      setError("Password must be at least 7 characters long.");
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await deleteDoc(doc(db, "products", productId));
      setUserProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== productId)
      );
      setConfirmationMessage("Product deleted successfully!");
      setIsSuccess(true);

      setTimeout(() => {
        setConfirmationMessage("");
        setIsSuccess(false);
      }, 3000);
    } catch (err) {
      setError("Failed to delete product");
      console.error(err);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
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
      {error && <div>{error}</div>}
      <div className={styles.user_form}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            className={styles.user_input}
            type="text"
            id="email"
            value={userIn.email}
            readOnly
          />
        </div>
        {loginProvider === "password" && (
          <div>
            <label htmlFor="username">Username:</label>
            <input
              className={styles.user_input}
              type="text"
              id="username"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
            />
            <button className={styles.save_user} onClick={handleUsernameChange}>
              Save Username
            </button>

            <label htmlFor="password">New Password:</label>
            <input
              className={styles.user_input}
              type="password"
              id="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button className={styles.save_user} onClick={handlePasswordChange}>
              Change Password
            </button>
          </div>
        )}
      </div>
      <button className={styles.logout_btn} onClick={handleLogout}>
        Log Out
      </button>
      <div>
        <h3>Your Products</h3>
        <div className={styles.catalog_container}>
          {userProducts.length > 0 ? (
            userProducts.map((product) => (
              <div key={product.id} className={styles.product_card}>
                {product.imageUrl && (
                  <img src={product.imageUrl} alt={product.name} />
                )}
                <h1>{product.name}</h1>
                <p>{product.description}</p>
                <p>{product.price}€</p>
                <button onClick={() => handleDeleteProduct(product.id)}>
                  Delete Product
                </button>
              </div>
            ))
          ) : (
            <p>You haven't added any products yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};
