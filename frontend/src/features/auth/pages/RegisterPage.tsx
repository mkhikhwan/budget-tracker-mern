import Button from "../../../shared/components/Button";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Auth.module.css"
import bgAuth from "../../../assets/cash-flying-purple-coral.webp";
import { useState } from "react";
import CountrySelect from "../components/CountrySelect";
import type { RegisterForm } from "../Auth.types";
import * as AuthApi from "../Auth.api";

function RegisterPage(){
    const navigate = useNavigate();
    const [formData, setFormData] = useState<RegisterForm>({
        name : "",
        email : "",
        country : "",
        password : "",
        confirmPassword : "",
    });

    const [errorForm, setErrorForm] = useState({
        name : "",
        email : "",
        country : "",
        password : "",
        confirmPassword : "",
    })

    const handleRegister = (e:React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const isValid = validate(formData);

        if (isValid) {
            const req = async () => {
                try {
                    await AuthApi.register(formData);
                    alert("Registration successful! Proceed to login.");
                    navigate("/login");
                } catch (e: unknown) {
                    alert(e instanceof Error ? e.message : "Registration failed. Please try again later.");
                }
            };
            req();
        } else {
            alert("Form is invalid!");
        }
    };

    const validate = (formData:RegisterForm)=>{
        const errors = {
            name: "",
            email: "",
            country: "",
            password: "",
            confirmPassword: "",
        };

        if (!formData.name.trim()) errors.name = "Name is required.";
        if (!formData.email.trim()) {
            errors.email = "Email is required.";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = "Email is invalid.";
        }
        if (!formData.country) errors.country = "Please select a country.";
        if (formData.password.length < 8) {
            errors.password = "Password must be at least 8 characters.";
        }
        if (formData.confirmPassword !== formData.password) {
            errors.confirmPassword = "Passwords do not match.";
        }

        setErrorForm(errors);
        return Object.values(errors).every((x) => x === "");
    }

    return (
        <div className={styles.container}>
            <div className={styles.authContainer}>
                <form className="form">
                    <h1 className={styles.header}>Register</h1>
                    <div className="form-row">
                        <input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} type="text" placeholder="Full Name"/>
                        {errorForm.name && <p className="form-error-label">*s{errorForm.name}</p>}
                    </div>
                    <div className="form-row">
                        <input value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} type="email" placeholder="E-mail"/>
                        {errorForm.email && <p className="form-error-label">*{errorForm.email}</p>}
                    </div>

                    <CountrySelect country={formData.country} setCountry={(val) => setFormData(prev => ({...prev, country: typeof val === 'function' ? val(prev.country) : val}))}/>
                    {errorForm.country && <p className="form-error-label">*{errorForm.country}</p>}

                    <div className="form-row">
                        <input value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} type="password" placeholder="Password"/>
                        {errorForm.password && <p className="form-error-label">*{errorForm.password}</p>}
                    </div>

                    <div className="form-row">
                        <input value={formData.confirmPassword} onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} type="password" placeholder="Confirm Password"/>
                        {errorForm.confirmPassword && <p className="form-error-label">*{errorForm.confirmPassword}</p>}
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