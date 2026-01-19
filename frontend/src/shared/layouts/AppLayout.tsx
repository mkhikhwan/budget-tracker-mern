import NavBar from "../components/NavBar";
import { Outlet } from "react-router-dom";

function AppLayout(){
    return (
        <div className="app">
            <NavBar></NavBar>

            <main className="content">
                <Outlet/>
            </main>
        </div>
    )
}

export default AppLayout;