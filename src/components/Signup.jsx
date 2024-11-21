import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  GithubAuthProvider,
} from "firebase/auth";
import { auth } from "../firebase";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import styles from "../css/LoginSignup.module.css";
import google from "../images/google.png";
import facebook from "../images/facebook.png";
import github from "../images/github.png";

const db = getFirestore();
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
const githubProvider = new GithubAuthProvider();

export const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save user data to Firestore
      await setDoc(doc(db, "users", user.uid), {
        username: username,
        email: email,
      });

      navigate("/"); // Redirect to home page
    } catch (err) {
      setError("Signup failed. Please check your details and try again.");
    }
  };

  const handleSocialSignup = async (provider) => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user already exists in Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) {
        // Save user data to Firestore (username and email)
        await setDoc(doc(db, "users", user.uid), {
          username: user.displayName || "User",
          email: user.email,
        });
      }

      navigate("/"); // Redirect to home page
    } catch (error) {
      setError("Social signup/login failed. Please try again.");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <div className={styles.socialButtons}>
          <button
            className={styles.socialButton}
            onClick={() => handleSocialSignup(facebookProvider)}
          >
            <img src={facebook} alt="facebook icon" className={styles.socialIcon} />
            Continue with Facebook
          </button>
          <button
            className={styles.socialButton}
            onClick={() => handleSocialSignup(githubProvider)}
          >
            <img src={github} alt="github icon" className={styles.socialIcon} />
            Continue with GitHub
          </button>
          <button
            className={styles.socialButton}
            onClick={() => handleSocialSignup(googleProvider)}
          >
            <img src={google} alt="google icon" className={styles.socialIcon} />
            Continue with Google
          </button>
        </div>

        <div className={styles.separator}>
          <span>OR</span>
        </div>

        <form onSubmit={handleSignup} className={styles.form}>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className={styles.input}
          />
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={styles.input}
          />
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={styles.input}
          />
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit" className={styles.submitButton}>
            Create Account
          </button>
        </form>
        <br />
        <p>
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
};
