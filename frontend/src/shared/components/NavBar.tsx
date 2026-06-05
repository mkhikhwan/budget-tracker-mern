import { useState, useEffect } from "react";
import styles from "./NavBar.module.css";
import { useLocation } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../features/auth/providers/AuthProvider";

function NavBar(){
    const [isOpen, setIsOpen] = useState(false);
    const auth = useAuth();

    const toggleSidebar = () => {
        setIsOpen(prev => !prev)
    };

    const location = useLocation();
    const isTransactionActive = location.pathname.startsWith("/transactions")

    useEffect(() => {
        setIsOpen(false);
    }, [location.pathname]);

    return (
        <>
            <div className={`${styles.darkOverlay} ${isOpen ? styles.toggleOverlay : ''}`} onClick={() => setIsOpen(false)}></div>
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
                    <li className={styles.navItem}>
                        <NavLink to="/settings" className={({ isActive }) => {
                            return `${styles.item} ${isActive ? `${styles.active}` : '' }`
                        }}>
                            <i className="fa-solid fa-gear"></i> Settings
                        </NavLink>
                    </li>
                    
                    <div className={styles.navFooter}>
                        <button className={styles.logout} onClick={auth.logout}>
                            Logout
                        </button>
                    </div>
                </ul>
            </nav>
        </>

    )
}

export default NavBar;