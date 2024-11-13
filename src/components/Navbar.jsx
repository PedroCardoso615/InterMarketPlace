import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import styles from "../css/Navbar.module.css";
import logo from "../images/IMPInv.png";

export const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Track if user is logged in
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleUserIconClick = () => {
    if (user) {
      navigate("/profile"); // Redirect to profile if user is logged in
    } else {
      navigate("/login"); // Redirect to login if no user is logged in
    }
  };

  // Hide Navbar in the Login and SignUp pages
  const hideNavbarPaths = ["/login", "/signup"];
  if (hideNavbarPaths.includes(location.pathname)) return null;

  return (
    <div>
      <header className={styles.header}>
        <div className={styles.logo}>
          <a href="/">
            <img className={styles.logo_detail} src={logo} alt="Logo" />
          </a>
        </div>
        <nav className={styles.navbar}>
          <Link to="/" className={styles.navli}>
            Home
          </Link>
          <Link to="/catalog" className={styles.navli}>
            Catalog
          </Link>
          <Link to="/listing" className={styles.navli}>
            Listing
          </Link>
          <Link to="/cart" className={styles.navli}>
            <img
              alt="cart"
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAARlJREFUSEvN1DEvBVEQhuHnRjRaiehEzQ9QqTQKnUKjFjQq8Rf0yC1UGlHoFBqFSvQUao1Eo1FJsEd2k83N3j1nd62YZoszM+9855uzAz3HoOf+/hTwlat5xyn2fkNdWUEBKPqu4KYrpOqK9nGIK6z1AZjGCyYwh+cukHEmn2GzQ+MLbIT6cYAl3HUAPGKxDhDOHrDQEnKQ+1j7DrYwbAH4zOpm8RpTMJUnhW+TuMZqURB7yUcZZLdJ99zcYPJPxADBg+BFarxhBh+pgJB3i+VEQvBsu5wbUxBywz6fJwLCet83BUziCfMRyGV2neujOSkKEoevTksFHGMnM/CkYqvqzqJbVIxV/pWPDlV3lgzoXUFrH1I9+L+Ab1GOKRnFFj/fAAAAAElFTkSuQmCC"
            />
          </Link>
          <div onClick={handleUserIconClick} className={styles.navli}>
            <img
              alt="user"
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAURJREFUSEvF1L8rRXEYx/HXTWaEwSiZLIpVRgulKBaLzWLwa7QopURS/gRZ5FcW/wAlGWQiIykMKKX8OKdc3c69557bOW6+2znn+3zen+fp85ycKp9clfVVCujFIjp+DF1gDsdJBisBjGKTIjOfGMRBOUgSoB43aIgRuUMb3uIgSYDQ4U7CGPpwlBYwjeUEwBRW0wIGsJ8A6MdhWkAdrtEUI3CPdrykBYR1I9gqIRCmaAi7WVKUr+3B0s8efOASszj5iz1I0ij7PSmmmcTD4nKAZswEm9oVzLkTjRHaI85xihU8lHITBxgLBNeDfIcpquQ8YRx70culAJPBr2GtEtUSd4axXfg+CmjFFWpSAl4RavyOKwrYwERK8XzZfGBwIf8QBdyiJSPgDN1xgHfUZgQ8F4Yj2sFXRvEi4/+6aH/STNU7+AYkwS0ZwQsJ3gAAAABJRU5ErkJggg=="
            />
          </div>
        </nav>
      </header>
      <hr className={styles.hr}/>
    </div>
  );
};
