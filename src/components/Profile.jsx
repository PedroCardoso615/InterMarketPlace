import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase'; // Adjust this path based on your project
import { updateProfile, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

function Profile() {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        setUser(currentUser);
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUsername(userData.username || '');
          setEmail(userData.email || currentUser.email);
        }
      }
      setIsLoading(false);
    };
    fetchUserData();
  }, []);

  const handleSaveChanges = async () => {
    if (user) {
      try {
        // Update Firebase Authentication profile
        await updateProfile(user, { displayName: username });
        
        // Update Firestore or Realtime Database user data
        await setDoc(doc(db, 'users', user.uid), { username, email }, { merge: true });
        alert('Profile updated successfully!');
      } catch (error) {
        console.error('Error updating profile:', error);
        alert('Failed to update profile. Please try again.');
      }
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert('Logged out successfully');
      window.location.reload(); // Reload to reset UI after logout
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Profile</h2>
      <form onSubmit={(e) => e.preventDefault()}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            readOnly // Email is typically managed by Firebase Auth, so we make it read-only
          />
        </div>
        <button onClick={handleSaveChanges} type="button">Save Changes</button>
      </form>
      <button onClick={handleLogout} style={{ marginTop: '20px' }}>
        Log Out
      </button>
    </div>
  );
}

export default Profile;