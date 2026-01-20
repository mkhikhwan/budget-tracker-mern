import NavBar from "../components/NavBar";
import { Outlet } from "react-router-dom";
import styles from "./AppLayout.module.css";

function AppLayout(){
    let isOpenNavBar:Boolean = true;

    return (
        <div className={styles.app}>
            <NavBar></NavBar>

            <main className={`${styles.content} ${isOpenNavBar ? styles.dim : ""}`}>
                <Outlet/>
            </main>
        </div>
    )
}

export default AppLayout;