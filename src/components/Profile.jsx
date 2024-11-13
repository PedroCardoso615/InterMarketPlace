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
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import styles from "../css/Catalog.module.css"; // Import the styles

const db = getFirestore();

export const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [newUsername, setNewUsername] = useState("");
  const [error, setError] = useState("");
  const [userProducts, setUserProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setUserData(docSnap.data());
            setNewUsername(docSnap.data().username);
          } else {
            console.log("No such document!");
          }

          // Get the products listed by the user
          const productsQuery = query(
            collection(db, "products"),
            where("userId", "==", user.uid)
          );
          const querySnapshot = await getDocs(productsQuery);
          const products = [];
          querySnapshot.forEach((doc) => {
            products.push({ ...doc.data(), id: doc.id });
          });
          setUserProducts(products);
        }
      } catch (err) {
        setError("Failed to retrieve user data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Logout button
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (err) {
      setError("Failed to log out");
      console.error(err);
    }
  };

  // Username change
  const handleUsernameChange = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (user && newUsername !== userData.username) {
      try {
        const docRef = doc(db, "users", user.uid);
        await updateDoc(docRef, { username: newUsername });
        setUserData((prevData) => ({ ...prevData, username: newUsername }));

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

  // Delete uploaded products
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
          style={{
            position: "sticky",
            top: 0,

            width: "100%",
            backgroundColor: isSuccess ? "#4CAF50" : "#f44336",
            color: "white",
            textAlign: "center",
            padding: "10px",
            fontWeight: "bold",
            transition: "all 0.3s ease",
          }}
        >
          {confirmationMessage}
        </div>
      )}
      {error && <div>{error}</div>}

      <div>
        <label htmlFor="email">Email:</label>
        <input type="text" id="email" value={userData.email} readOnly />
      </div>

      <div>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
        />
        <button onClick={handleUsernameChange}>Save Username</button>
      </div>
      <button className={styles.logout} onClick={handleLogout}>
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
