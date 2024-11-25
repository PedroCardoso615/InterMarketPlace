import React, { useState, useEffect } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import styles from "../css/Navbar.module.css";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../images/IMPInv.png";
import { RxHamburgerMenu } from "react-icons/rx";

export const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Track if user is logged in.
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleUserIconClick = () => {
    if (user) {
      navigate("/profile"); // Redirect to profile if user is logged in.
    } else {
      navigate("/signup"); // Redirect to login if no user is logged in.
    }
  };

  // Hide Navbar in the Login and SignUp pages
  const hideNavbarPaths = ["/login", "/signup"];
  if (hideNavbarPaths.includes(location.pathname)) return null;

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <header>
        <div className={styles.container}>
          <nav>
            <div className={styles.logo}>
              <a href="/">
                <img className={styles.logo_detail} src={logo} alt="Logo" />
              </a>
            </div>
            <ul className={`${styles.nav_link} ${isOpen ? styles.active : ""}`}>
              <li>
                <a href="/" className={styles.active}>
                  Home
                </a>
              </li>
              <li>
                <a href="/catalog" className={styles.active}>
                  Catalog
                </a>
              </li>
              <li>
                <a href="/listing" className={styles.active}>
                  Listing
                </a>
              </li>
              <li>
                <a href="/cart" className={styles.active}>
                  <img
                    alt="cart"
                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAARlJREFUSEvN1DEvBVEQhuHnRjRaiehEzQ9QqTQKnUKjFjQq8Rf0yC1UGlHoFBqFSvQUao1Eo1FJsEd2k83N3j1nd62YZoszM+9855uzAz3HoOf+/hTwlat5xyn2fkNdWUEBKPqu4KYrpOqK9nGIK6z1AZjGCyYwh+cukHEmn2GzQ+MLbIT6cYAl3HUAPGKxDhDOHrDQEnKQ+1j7DrYwbAH4zOpm8RpTMJUnhW+TuMZqURB7yUcZZLdJ99zcYPJPxADBg+BFarxhBh+pgJB3i+VEQvBsu5wbUxBywz6fJwLCet83BUziCfMRyGV2neujOSkKEoevTksFHGMnM/CkYqvqzqJbVIxV/pWPDlV3lgzoXUFrH1I9+L+Ab1GOKRnFFj/fAAAAAElFTkSuQmCC"
                  />
                </a>
              </li>
              <li onClick={handleUserIconClick}>
                <button className={styles.active}>
                  <img
                    alt="user"
                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAURJREFUSEvF1L8rRXEYx/HXTWaEwSiZLIpVRgulKBaLzWLwa7QopURS/gRZ5FcW/wAlGWQiIykMKKX8OKdc3c69557bOW6+2znn+3zen+fp85ycKp9clfVVCujFIjp+DF1gDsdJBisBjGKTIjOfGMRBOUgSoB43aIgRuUMb3uIgSYDQ4U7CGPpwlBYwjeUEwBRW0wIGsJ8A6MdhWkAdrtEUI3CPdrykBYR1I9gqIRCmaAi7WVKUr+3B0s8efOASszj5iz1I0ij7PSmmmcTD4nKAZswEm9oVzLkTjRHaI85xihU8lHITBxgLBNeDfIcpquQ8YRx70culAJPBr2GtEtUSd4axXfg+CmjFFWpSAl4RavyOKwrYwERK8XzZfGBwIf8QBdyiJSPgDN1xgHfUZgQ8F4Yj2sFXRvEi4/+6aH/STNU7+AYkwS0ZwQsJ3gAAAABJRU5ErkJggg=="
                  />
                </button>
              </li>
            </ul>
            <div className={styles.icon} onClick={toggleMenu}>
              <RxHamburgerMenu />
            </div>
          </nav>
        </div>
      </header>
      <hr className={styles.hr} />
    </>
  );
};
