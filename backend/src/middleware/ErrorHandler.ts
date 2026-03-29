import { Request, Response, NextFunction } from 'express';

const ErrorHandler = async (
    err: any, 
    req: Request, 
    res: Response, 
    next: NextFunction
) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    console.error("ERROR: ", err);

    res.status(statusCode).json({
        message: message,
    });
}

export default ErrorHandler;