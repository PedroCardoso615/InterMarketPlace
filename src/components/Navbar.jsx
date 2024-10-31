import {Link} from 'react-router-dom';
import styles from '../css/Navbar.module.css';
import logo from '../images/ReactInv3.png';

function Navbar() {
    return (
        <header className={styles.header}>
            <div className={styles.logo}>
                <img className={styles.logo_detail} src={logo} alt="Logo"></img>
            </div>
            <nav className={styles.navbar}>
                <ul className={styles.navul}>
                    <Link to="/" className={styles.navli}>Home</Link>
                    <Link to="/catalog" className={styles.navli}>Catalog</Link>
                    <Link to="/listing" className={styles.navli}>Listing</Link>
                    <Link to="/profile" className={styles.navli}>Profile</Link>
                </ul>
            </nav>
            <div className={styles.nav_right}>
                <Link to="/cart" className={styles.cart}>Cart</Link>
                <Link to="/signup" className={styles.nav_acc}>Sign Up</Link>
                <Link to="/login" className={styles.nav_acc}>Login</Link>
            </div>
        </header>
      );
}

export default Navbar;