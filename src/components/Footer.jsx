import React from "react";
import styles from "../css/Footer.module.css";
import fb from "../images/facebook.png";
import twitter from "../images/twitter.png";
import tiktok from "../images/tik-tok.png";
import insta from "../images/instagram.png";

export const Footer = () => {
  return (
    <div className={styles.footer_container}>
      <div className={styles.footer}>
        <div className={styles.footer_links}>
          <div className={styles.footer_links_div}>
            <h4>For Business</h4>
            <p>Employer</p>
            <p>Health Plan</p>
            <p>Individual</p>
          </div>
          <div className={styles.footer_links_div}>
            <h4>Resources</h4>
            <p>Resource Center</p>
            <p>Testimonials</p>
            <p>STV</p>
          </div>
          <div className={styles.footer_links_div}>
            <h4>Partners</h4>
            <p>Tech Of</p>
          </div>
          <div className={styles.footer_links_div}>
            <h4>Company</h4>
            <p>About</p>
            <p>Press</p>
            <p>Careers</p>
            <p>Contact</p>
          </div>
          <div className={styles.footer_links_div}>
            <h4>Coming Soon On</h4>
            <div className={styles.socialmedia}>
              <p>
                <img alt="socialmedia" src={insta} />
              </p>
              <p>
                <img alt="socialmedia" src={tiktok} />
              </p>
              <p>
                <img alt="socialmedia" src={fb} />
              </p>
              <p>
                <img alt="socialmedia" src={twitter} />
              </p>
            </div>
          </div>
        </div>

        <hr />

        <div className={styles.footer_below}>
          <div className={styles.footer_copyright}>
            <p>
              @{new Date().getFullYear()} Pedro Cardoso. All rights reserved.
            </p>
          </div>
          <div className={styles.footer_below_links}>
            <div>
              <p>Terms & Conditions</p>
            </div>
            <div>
              <p>Privacy</p>
            </div>
            <div>
              <p>Security</p>
            </div>
            <div>
              <p>Cookie Declaration</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
