import type { UserTokenPayload } from "@budget-now/contract";
import { apiClient } from "../../shared/api/apiClient";
import { mapLoginFormToDto, mapRegisterFormToDto } from "./Auth.mapper";
import type { LoginForm, RegisterForm } from "./Auth.types";

export function login(credentials: LoginForm): Promise<{ message: string, user: UserTokenPayload }> {
    const dto = mapLoginFormToDto(credentials);
    return apiClient("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(dto)
    });
}

export function register(data: RegisterForm): Promise<{ message: string }> {
    const dto = mapRegisterFormToDto(data);
    return apiClient("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(dto)
    });
}

export function logout(): Promise<{ message: string }> {
    return apiClient("/api/auth/logout", {
        method: "POST"
    });
}

export async function me(): Promise<{ user: UserTokenPayload }> {
    const res = await fetch("http://localhost:5000/api/auth/me", {
        credentials: "include"
    });
    if (!res.ok) throw new Error("Cannot authenticate.");
    return res.json();
}