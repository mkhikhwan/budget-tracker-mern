import { useState } from "react";
import styles from "./NavBar.module.css";
import { Link } from "react-router-dom";

function NavBar(){
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => {
        setIsOpen(prev => !prev)
    };

    return (
        <nav className={`${styles.navbar} ${isOpen ? styles.open : ''}`}>
            <div className={styles.logoRow}>
                <div className={styles.logo}>
                    <i className="fa-solid fa-money-bill-1-wave"></i> BUDGETNOW
                </div>

                <div className={styles.navToggle} onClick={toggleSidebar}>
                    <i className={`fa-solid ${isOpen ? "fa-angle-left" : "fa-angle-right"}`}></i>
                </div>
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
                <li className={styles.navItem}>
                    <Link className={styles.item} to="/expenses">
                        <i className="fa-solid fa-receipt"></i> Expenses
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