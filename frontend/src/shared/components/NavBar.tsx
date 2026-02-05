import { useState } from "react";
import styles from "./NavBar.module.css";
import { Link, useLocation } from "react-router-dom";
import { NavLink } from "react-router-dom";

function NavBar(){
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => {
        setIsOpen(prev => !prev)
    };

    const location = useLocation();
    const isTransactionActive = location.pathname.startsWith("/transactions")

    return (
        <>
            <div className={`${styles.darkOverlay} ${isOpen ? styles.toggleOverlay : ''}`}></div>
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
                        <NavLink to="/" className={({ isActive }) => {
                            return `${styles.item} ${isActive ? `${styles.active}` : '' }`
                        }}>
                            <i className="fa-solid fa-home"></i> Home
                        </NavLink>
                    </li>
                    <li className={styles.navItem}>
                        <NavLink to="/dashboard" className={({ isActive }) => {
                            return `${styles.item} ${isActive ? `${styles.active}` : '' }`
                        }}>
                            <i className="fa-solid fa-chart-line"></i> Dashboard
                        </NavLink>
                    </li>
                    <li className={styles.navItem}>
                        <NavLink to="/transactions" className={({ isActive }) => {
                            return `${styles.item} ${isActive ? `${styles.active}` : '' }`
                        }} end>
                            <i className="fa-solid fa-receipt"></i> Transactions
                        </NavLink>
                        <ul className={`${styles.subNavList} ${isTransactionActive ? styles.active : ''}`}>
                            <li className={styles.subNavItem}>
                                <NavLink to="/transactions/add" className={({ isActive }) => {
                                    return `${styles.subItem} ${isActive ? `${styles.active}` : '' }`
                                }}>
                                    Add Transaction
                                </NavLink>
                            </li>
                        </ul>
                    </li>
                    <div className={styles.navFooter}>
                        <button className={styles.logout}>
                            Logout
                        </button>
                    </div>
                </ul>
            </nav>
        </>

    )
}

export default NavBar;