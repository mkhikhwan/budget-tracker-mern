import { Outlet } from "react-router-dom";
import styles from "./AppLayout.module.css";

function AuthLayout(){
    return (
        <div className={styles.app}>
            <main className={`${styles.content}`}>
                <Outlet/>
            </main>
        </div>
    )
}

export default AuthLayout;