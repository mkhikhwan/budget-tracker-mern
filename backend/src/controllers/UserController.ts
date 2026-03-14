import { Request, Response } from "express"
import * as UserService from "src/services/UserService"
import { LoginDto, RegisterDto } from "@budget-now/contract";

export const login = async (req: Request, res:Response)=>{
    const request:LoginDto = req.body;

    const result = await UserService.login(request.email, request.password);
    const token = result.accessToken;

    res.cookie('token', token, { httpOnly: true, secure: true });
    return res.status(201).json({ 
        message: "Login Successful",
        token: token,
    });
};

export const register = async (req: Request, res:Response)=>{
    const request:RegisterDto = req.body;

    const result = await UserService.register(
        request.name,
        request.email,
        request.password,
        request.confirmPassword,
        request.country
    )

    return res.status(201).json({ 
        message: "Register Successful. Please login."
    });
};