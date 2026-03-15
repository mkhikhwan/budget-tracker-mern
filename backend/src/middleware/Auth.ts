import { Request, Response, NextFunction } from 'express';
import jwt from "jsonwebtoken"

const Auth = (req:Request, res:Response, next:NextFunction) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(' ')[1];

    const SECRET = process.env.JWT_SECRET;
    if (!SECRET) {
        throw new Error("FATAL ERROR: JWT_SECRET is not defined.");
    }

    if(!token){
        return res.status(401).json({ message : "Access Denied: No token provided." });
    }

    try{
        const verified = jwt.verify(token, SECRET);
        req.user = verified;

        next();
    }catch(e: unknown){
        return res.status(401).json({ message : "Invalid or expired token." });
    }
}

export default Auth