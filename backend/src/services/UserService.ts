import { User, UserModel } from "src/models/User";
import AppError from "src/utils/AppError";
import jwt from "jsonwebtoken";

export const login = async (email:string, password:string): Promise<{ accessToken: string }> => {
    const user = await UserModel.findByEmail(email) as User;
    if(!user){
        throw new AppError("Invalid Email or Password", 401);
    }

    const isPasswordMatch = user.password ? await UserModel.verifyPassword(user.password!, password) : false;
    if(!isPasswordMatch){
        throw new AppError("Invalid Email or Password", 401);
    }

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