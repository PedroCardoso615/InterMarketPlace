import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import styles from '../css/LoginSignup.module.css';

const db = getFirestore();

export const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save additional data (username and email only) to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        username: username,
        email: email,
      });

      // Redirect to home or dashboard
      navigate('/home'); // Redirect to home page
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <div className={styles.socialButtons}>
          <button className={styles.socialButton}>Continuar com o Facebook</button>
          <button className={styles.socialButton}>Continuar com o Apple</button>
          <button className={styles.socialButton}>Continuar com o Google</button>
        </div>

        <div className={styles.separator}>
          <span>OU</span>
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
            Criar conta
          </button>
        </form>
        <br />
        <p>
          Já tens conta? <a href="/login">Entrar</a>
        </p>
      </div>
    </div>
  );
};