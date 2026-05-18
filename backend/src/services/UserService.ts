import { User, UserModel } from "../models/User";
import AppError from "../utils/AppError";
import jwt from "jsonwebtoken";
import { UserTokenPayload } from "@budget-now/contract";

export const login = async (email:string, password:string): Promise<{ user: UserTokenPayload, accessToken: string }> => {
    const user = await UserModel.findByEmail(email) as User;
    if(!user){
        throw new AppError("Invalid Email or Password", 401);
    }

    const isPasswordMatch = user.password ? await UserModel.verifyPassword(user.password!, password) : false;
    if(!isPasswordMatch){
        throw new AppError("Invalid Email or Password", 401);
    }

    const payload: UserTokenPayload = {
        id: user._id!.toString(), 
        email: user.email,
        country: user.country
    }

    const token = jwt.sign(
        payload, 
        process.env.JWT_SECRET || 'secret', 
        { expiresIn: '1h' }
    );

    return { 
        user: payload,
        accessToken: token 
    };
};

export const register = async (
    name:string,
    email:string,
    password:string,
    confirmPassword:string,
    country:string,
)=>{
    if(password !== confirmPassword ){
        throw new AppError("Confirm Password and Password not matching.", 401);
    }

    const existingUser = await UserModel.findByEmail(email);
    if(existingUser){
        throw new AppError("Email already in use", 401);
    }

    const newUser = await UserModel.prepareUser({
        name,
        email,
        password,
        country
    });
    if(!newUser){
        throw new AppError("Invalid data received", 403);
    }

    const result = await UserModel.create(newUser);

    return result
};

export const getSettings = async (userId: string) => {
    const settings = await UserModel.getSettings(userId);
    if (!settings) {
        throw new AppError("User not found", 404);
    }
    return settings;
};

export const updateSettings = async (userId: string, settings: { country: string }) => {
    const result = await UserModel.updateSettings(userId, settings);
    if (result.matchedCount === 0) {
        throw new AppError("User not found", 404);
    }
    return result;
};