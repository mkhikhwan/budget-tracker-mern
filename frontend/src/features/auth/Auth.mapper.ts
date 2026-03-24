import type { LoginDto, RegisterDto } from "@budget-now/contract";
import type { LoginForm, RegisterForm } from "./Auth.types";

export const mapLoginFormToDto = (form: LoginForm): LoginDto => {
    return {
        email: form.email,
        password: form.password,
    };
};

export const mapRegisterFormToDto = (form: RegisterForm): RegisterDto => {
    return {
        name: form.name,
        email: form.email,
        country: form.country,
        password: form.password,
        confirmPassword: form.confirmPassword,
    };
};
