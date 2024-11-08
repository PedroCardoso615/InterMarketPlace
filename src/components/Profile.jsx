// import React, { useEffect, useState } from 'react';
// import { auth } from '../firebase';
// import { getFirestore, doc, getDoc } from 'firebase/firestore';
// import { signOut } from 'firebase/auth';

// const db = getFirestore();

// function Profile() {
//   const [userData, setUserData] = useState(null);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const user = auth.currentUser; // Get the currently logged-in user
//         if (user) {
//           const docRef = doc(db, 'users', user.uid);
//           const docSnap = await getDoc(docRef);
          
//           if (docSnap.exists()) {
//             setUserData(docSnap.data()); // Set user data to state
//           } else {
//             console.log('No such document!');
//           }
//         }
//       } catch (err) {
//         setError('Failed to retrieve user data');
//         console.error(err);
//       }
//     };

//     fetchUserData();
//   }, []); // Only run this effect once on component mount

//   const handleLogout = async () => {
//     try {
//       await signOut(auth); // Log out the user
//       console.log('User logged out');
//       // Optionally, you can redirect the user to another page after logging out
//     } catch (err) {
//       setError('Failed to log out');
//       console.error(err);
//     }
//   };

//   if (!userData) return <div>Loading...</div>; // Display a loading message while data is being fetched

//   return (
//     <div>
//       <h2>User Profile</h2>
//       {error && <p>{error}</p>}
//       <p>Username: {userData.username}</p>
//       <p>Email: {userData.email}</p>
//       <button onClick={handleLogout}>Log Out</button>
//     </div>
//   );
// }

// export default Profile;

import React, { useEffect, useState } from 'react';
import { auth } from '../firebase';
import { getFirestore, doc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection

const db = getFirestore();

function Profile() {
  const [userData, setUserData] = useState(null);
  const [newUsername, setNewUsername] = useState('');
  const [error, setError] = useState('');
  const [userProducts, setUserProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          // Fetch user data
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            setUserData(docSnap.data());
            setNewUsername(docSnap.data().username); // Set current username as initial value
          } else {
            console.log('No such document!');
          }
          
          // Fetch products added by the user
          const productsQuery = query(
            collection(db, 'products'),
            where('userId', '==', user.uid)  // Assuming 'userId' or 'uid' is a field in your products collection
          );
          const querySnapshot = await getDocs(productsQuery);
          const products = [];
          querySnapshot.forEach((doc) => {
            products.push(doc.data());
          });
          setUserProducts(products);
        }
      } catch (err) {
        setError('Failed to retrieve user data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []); // Only run this effect once on component mount

  const handleLogout = async () => {
    try {
      await signOut(auth); // Sign out the user
      console.log('User logged out');
      
      // Redirect to the login page after logging out
      navigate('/login'); // Assuming your login page is at '/login'
    } catch (err) {
      setError('Failed to log out');
      console.error(err);
    }
  };

  const handleUsernameChange = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (user && newUsername !== userData.username) {
      try {
        const docRef = doc(db, 'users', user.uid);
        await updateDoc(docRef, { username: newUsername }); // Update Firestore with the new username
        setUserData((prevData) => ({ ...prevData, username: newUsername }));
        
        // Display the confirmation message
        setConfirmationMessage('Username updated successfully!');
        setIsSuccess(true);
        
        // Hide the confirmation message after 3 seconds
        setTimeout(() => {
          setConfirmationMessage('');
          setIsSuccess(false);
        }, 3000);
        
        console.log('Username updated');
      } catch (err) {
        setError('Failed to update username');
        console.error(err);
      }
    }
  };

  if (loading) return <div>Loading...</div>; // Display a loading message while data is being fetched

  return (
    <div style={{ position: 'relative' }}>
      <h2>User Profile</h2>
      {error && <p>{error}</p>}
      <p>Email: {userData.email}</p>

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

      <div>
        <h3>Your Products</h3>
        {userProducts.length > 0 ? (
          <ul>
            {userProducts.map((product, index) => (
              <li key={index}>
                <p>{product.name}</p>
                <p>{product.description}</p>
                <p>Price: ${product.price}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>You haven't added any products yet.</p>
        )}
      </div>

      <button onClick={handleLogout}>Log Out</button>

      {/* Confirmation message at the bottom */}
      {confirmationMessage && (
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            backgroundColor: isSuccess ? '#4CAF50' : '#f44336',
            color: 'white',
            textAlign: 'center',
            padding: '10px',
            fontWeight: 'bold',
            transition: 'all 0.3s ease',
          }}
        >
          {confirmationMessage}
        </div>
      )}
    </div>
  );
}

export default Profile;


