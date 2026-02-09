import { Request, Response } from "express";
import * as TransactionService from "../services/TransactionService"

export const createTransaction = async (req: Request, res:Response) => {
    const transaction = await TransactionService.createTransaction(req.body);

    res.status(201).json(transaction);
};