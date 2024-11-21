import React, { useState } from "react";
import {
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  GithubAuthProvider,
} from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import styles from "../css/LoginSignup.module.css";
import google from "../images/google.png";
import facebook from "../images/facebook.png";
import github from "../images/github.png";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const googleProvider = new GoogleAuthProvider();
  const facebookProvider = new FacebookAuthProvider();
  const githubProvider = new GithubAuthProvider();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err) {
      setError("The provided credentials do not match our records.");
    }
  };

  const handleGoogleLogin = () => {
    signInWithPopup(auth, googleProvider)
      .then((result) => navigate("/"))
      .catch((error) => setError("Google login failed. Please try again."));
  };

  const handleFacebookLogin = () => {
    signInWithPopup(auth, facebookProvider)
      .then((result) => navigate("/"))
      .catch((error) => setError("Facebook login failed. Please try again."));
  };

  const handleAppleLogin = () => {
    signInWithPopup(auth, githubProvider)
      .then((result) => navigate("/"))
      .catch((error) => setError("Apple login failed. Please try again."));
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <div className={styles.socialButtons}>
          <button className={styles.socialButton} onClick={handleFacebookLogin}>
            <img src={facebook} alt="facebook icon" className={styles.socialIcon} />
            Continue with Facebook
          </button>
          <button className={styles.socialButton} onClick={handleAppleLogin}>
            <img src={github} alt="github icon" className={styles.socialIcon} />
            Continue with GitHub
          </button>
          <button className={styles.socialButton} onClick={handleGoogleLogin}>
            <img src={google} alt="google icon" className={styles.socialIcon} />
            Continue with Google
          </button>
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

