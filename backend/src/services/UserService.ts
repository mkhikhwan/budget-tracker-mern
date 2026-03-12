import { UserModel } from "src/models/User";
import AppError from "src/utils/AppError";
import argon2 from "argon2";
import jwt from "jsonwebtoken";

export const login = async (email:string, password:string): Promise<{ accessToken: string }> => {
    const filter = { email: email };

    const user = await UserModel.collection().findOne(filter);
    const isMatch = user?.password ? await argon2.verify(user.password, password) : false;

    if(!user || !isMatch) throw new AppError("Invalid E-mail or Password", 401);

    const token = jwt.sign(
        { sub: user._id, email: user.email }, 
        process.env.JWT_SECRET || 'secret', 
        { expiresIn: '1h' }
    );

    return { accessToken: token };
};

export const register = async (
    name:string,
    email:string,
    password:string, 
    confirmPassword:string,
    country:string, 
)=>{
    throw new AppError("Cannot Register", 403);
};