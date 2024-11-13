import React from "react";
import logo from "../images/Banner5.jpeg";
import styles from '../css/Home.module.css';

export const Home = () => {
  return(
    <>
    <div className={styles.container}>
    <img className={styles.banner} src={logo} alt="Banner" ></img>
    </div> 
    </>
  );
};
