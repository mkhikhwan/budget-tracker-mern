import styles from "./NavBar.module.css";
import { Link } from "react-router-dom";

function NavBar(){
    return (
        <nav className={styles.navbar}>
            <div className={styles.logo}>
                <i className="fa-solid fa-money-bill-1-wave"></i> BUDGETNOW
            </div>
            <ul className={styles.navList}>
                <li className={styles.navItem}>
                    <Link className={styles.item} to="/">
                        <i className="fa-solid fa-home"></i> Home
                    </Link>
                </li>
                <li className={styles.navItem}>
                    <Link className={styles.item} to="/dashboard">
                        <i className="fa-solid fa-chart-line"></i> Dashboard
                    </Link>
                </li>
                <div className={styles.navFooter}>
                    <button className={styles.logout}>
                        Logout
                    </button>
                </div>
            </ul>
        </nav>
    )
}

export default NavBar;