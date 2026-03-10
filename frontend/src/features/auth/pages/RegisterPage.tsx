import Button from "../../../shared/components/Button";
import { Link } from "react-router-dom";
import styles from "./Auth.module.css"
import bgAuth from "../../../assets/cash-flying-purple-coral.webp";
import { useState } from "react";
import CountrySelect from "../components/CountrySelect";

function RegisterPage(){
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [country, setCountry] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleRegister = (e:React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        console.log({ name, email, country, password, confirmPassword });
    }

    return (
        <div className={styles.container}>
            <div className={styles.authContainer}>
                <form className="form">
                    <h1 className={styles.header}>Register</h1>
                    <div className="form-row">
                        <input value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder="Full Name"/>
                    </div>
                    <div className="form-row">
                        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="E-mail"/>
                    </div>

                    <CountrySelect country={country} setCountry={setCountry}/>

                    <div className="form-row">
                        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password"/>
                    </div>

                    <div className="form-row">
                        <input value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} type="password" placeholder="Confirm Password"/>
                    </div>

                    <Button 
                        type="primary" 
                        style={{
                            padding: '8px',
                            fontSize: '1rem',
                            fontWeight: '800',
                            marginTop : '16px'
                        }} 
                        onClick={handleRegister}
                    >
                        Register
                    </Button>
                    <div style={{ margin: '8px 0',textAlign: 'center', color: '#666' }}>OR</div>
                    <Button type="secondary" style={{
                        padding: '8px',
                        fontSize: '1rem',
                        fontWeight: '800',
                        backgroundColor: '#fff',
                        color: '#757575',
                        border: '1px solid #ddd',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px'
                    }}>
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{ width: '18px' }} />
                        Continue with Google
                    </Button>

                    <div className={styles.footer}>
                        <p>Already have an account? <Link to="/login">Login</Link></p>
                    </div>
                </form>
            </div>
            <div className={styles.visualBackground}>
                <img 
                    src={bgAuth} 
                    alt="Background" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
            </div>
        </div>
    )
}

export default RegisterPage;