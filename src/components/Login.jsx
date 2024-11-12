import React, { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import styles from "../css/LoginSignup.module.css";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Redirect to home
      navigate("/home");
    } catch (err) {
      setError("The provided credentials do not match our records.");
    }
  };
  
  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <div className={styles.socialButtons}>
          <button className={styles.socialButton}>Continue with Facebook</button>
          <button className={styles.socialButton}>Continue with Apple</button>
          <button className={styles.socialButton}>Continue with Google</button>
        </div>

        <div className={styles.separator}>
          <span>OR</span>
        </div>

        <form onSubmit={handleLogin} className={styles.form}>
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
            Login
          </button>
        </form>
        <br />
        <p>
          Don't have an account? <a href="/signup">Create an account</a>
        </p>
      </div>
    </div>
  );
};
