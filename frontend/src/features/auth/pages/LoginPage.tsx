import Button from "../../../shared/components/Button";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Auth.module.css"
import bgAuth from "../../../assets/cash-flying-purple-coral.webp";
import { useState } from "react";
import type { LoginForm } from "../Auth.types";
import * as AuthApi from "../Auth.api";
import { useAuth } from "../providers/AuthProvider";

function LoginPage(){
    const navigate = useNavigate();
    const auth = useAuth();
    const [formData, setFormData] = useState<LoginForm>({
        email : "",
        password : "",
    });

    const [errorForm, setErrorForm] = useState({
        email : "",
        password : "",
    })

    const handleLogin = (e:React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const isValid = validate(formData);

        if (isValid) {
            const req = async () => {
                try {
                    const res = await AuthApi.login(formData);

                    const user = res.user;
                    auth.login(user);
                
                    navigate("/dashboard");
                } catch (e: unknown) {
                    alert(e instanceof Error ? e.message : "Login failed. Please try again later.");
                }
            };
            req();
        } else {
            alert("Form is invalid!");
        }
    }

    const validate = (formData:LoginForm)=>{
        const errors = {
            email: "",
            password: "",
        };

        if (!formData.email.trim()) errors.email = "Email is required.";
        if (!formData.password) errors.password = "Password is required.";

        setErrorForm(errors);
        return Object.values(errors).every((x) => x === "");
    }

    return (
        <div className={styles.container}>
            <div className={styles.authContainer}>
                <form className="form">
                    <h1 className={styles.header}>Login</h1>
                    <div className="form-row">
                        <input value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} type="email" placeholder="E-mail"/>
                        {errorForm.email && <p className="form-error-label">*{errorForm.email}</p>}
                    </div>
                    <div className="form-row">
                        <input value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} type="password" placeholder="Password"/>
                        {errorForm.password && <p className="form-error-label">*{errorForm.password}</p>}
                    </div>

                    <Button type="primary" style={{
                        padding: '8px',
                        fontSize: '1rem',
                        fontWeight: '800',
                        marginTop : '32px'
                    }} onClick={handleLogin} >Login</Button>

                    {/* <div style={{ margin: '16px 0', textAlign: 'center', color: '#666' }}>OR</div>

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
                    </Button> */}

                    <div className={styles.footer}>
                        <p>Dont have an account? <Link to="/register">Register</Link></p>
                        <Link to="/forgot-password" style={{ marginTop: '16px', display: 'block' }}><p>Forgot Password</p></Link>
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

export default LoginPage;