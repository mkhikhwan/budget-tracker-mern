import { Request, Response } from "express"

export const login = async (req: Request, res:Response)=>{
    try{
        const request = req.body;

        // TODO: Create Login Service

        return res.status(201).json({message: "Login Successful"})
    }catch(err: unknown){
        return res.status(500).json({message: "Failed to login"})
    }
};

export const register = async (req: Request, res:Response)=>{
    try{
        const request = req.body;

        // TODO: Create Register Service

        return res.status(201).json({message: "Registration Successful"})
    }catch(err: unknown){
        return res.status(500).json({message: "Failed to register"})
    }
};