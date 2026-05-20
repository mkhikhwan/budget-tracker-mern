import { Request, Response } from "express"
import * as UserService from "../services/UserService"
import { 
    LoginDto, 
    RegisterDto, 
    UserTokenPayload, 
    GetUserSettingsResponseDto,
    UpdateUserSettingsRequestDto
} from "@budget-now/contract";

export const login = async (req: Request, res:Response)=>{
    const request:LoginDto = req.body;

    const result = await UserService.login(request.email, request.password);
    const token = result.accessToken;

    res.cookie('token', token, { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production', // Only use secure in production (HTTPS)
        sameSite: 'lax'
    });
    return res.status(201).json({ 
        message: "Login Successful",
        user: result.user,
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

export const verify = async (req: Request, res: Response) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    return res.status(200).json({
        user: req.user
    });
}

export const logout = async (req: Request, res: Response) => {
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(0), // Set expiration to 1970
        path: '/',            // Must match the path used when set
    });

    res.status(200).json({ message: 'Logged out successfully' });
}

export const getSettings = async (req: Request, res: Response) => {
    const user = req.user as UserTokenPayload;
    const settings = await UserService.getSettings(user.id);
    console.log(settings);

    const response: GetUserSettingsResponseDto = {
        settings: settings
    }
    
    return res.status(200).json(response);
};

export const updateSettings = async (req: Request, res: Response) => {
    const user = req.user as UserTokenPayload;
    const request: UpdateUserSettingsRequestDto = req.body;
    const newSettings = request.settings;

    console.log(request);

    await UserService.updateSettings(user.id, newSettings);

    return res.status(200).json({
        message: "Settings updated successfully"
    });
};