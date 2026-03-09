import { Request, Response } from "express";
import * as TransactionService from "../services/TransactionService"
import { ObjectId } from "mongodb";

import { 
    TransactionDto,
    ImageDto,
    CreateTransactionRequestDto,
    CreateTransactionResponseDto,
    GetTransactionDetailsResponseDto,
    GetAllTransactionsResponseDto,
    EditTransactionRequestDto
} from "@budget-now/contract"
import { Image } from "src/models/Image";

export const createTransaction = async (req: Request, res:Response) => {
    try{
        const payload = req.body;
        if(!payload) return res.status(500).json({message: "Failed to create transaction"})

        const { type, name, amount, category, description, date }: CreateTransactionRequestDto = payload;

        const result: CreateTransactionResponseDto = await TransactionService.createTransaction(
            type,
            name,
            amount,
            category,
            description,
            date
        );

        return res.status(201).json(result);
    }catch(err: unknown){
        return res.status(500).json({message: "Failed to create transaction"})
    }
};

export const addImages = async (req: Request, res:Response) => {
    try{
        const images = req.files as Express.Multer.File[];
        const id : string | string[] = req.params.id;

        if (typeof id !== 'string' || !ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid or missing transaction ID" });
        }

        const result = await TransactionService.addImagesToTransaction(id, images);

        return res.status(201).json(result);
    }catch(err: unknown){
        return res.status(500).json({message: `Failed to add Images to Transaction: ${req.params.id}`})
    }
};

export const deleteImages = async (req: Request, res:Response) => {
    try{
        const response = { ...req.body };
        const ids:string[] = response.ids;

        const result = await TransactionService.deleteImages(ids);

        return res.status(201).json({ status: "success" });

    }catch(err: unknown){
        return res.status(500).json({message: `Failed to add Images to Transaction: ${req.params.id}`})
    }
}

export const getAllTransaction = async (req: Request, res:Response) => {
    try{
        const result = await TransactionService.getAllTransaction();
        const transactionList: TransactionDto[] = result.map((t)=>{
            const newTransaction:TransactionDto = {
                _id: t._id.toString(),
                type: t.type,
                name: t.name,
                amount: t.amount,
                category: t.category,
                description: t.description,
                date: t.date,
            }

            return newTransaction
        });

        const response:GetAllTransactionsResponseDto = {
            transactions : transactionList
        }

        return res.status(200).json(response);
    }catch(err: unknown){
        return res.status(500).json({message: "Failed to get all transactions"})
    }
}

export const getTransactionDetails = async (req: Request, res:Response) => {
    try{
        const id : string | string[] = req.params.id;

        if (typeof id !== 'string' || !ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid or missing transaction ID" });
        }

        const result = await TransactionService.getTransactionDetails(id);
        if (!result) {
            return res.status(404).json({ message: "Transaction not found" });
        }

        const images:ImageDto[] = result.images.map((img: Image) => ({
            _id: img._id?.toString(),
            transactionId: img.transactionId.toString(),
            url: `http://localhost:5000/uploads/${img.filename}`,
        }))

        const response:GetTransactionDetailsResponseDto = {
            _id: result._id.toString(),
            type: result.type,
            name: result.name,
            amount: result.amount,
            category: result.category,
            description: result.description,
            date: result.date,
            images: images,
        } 

        return res.status(200).json(response);
    }catch(err: unknown){
        return res.status(500).json({message: "Failed to get transaction details."})
    }
}

export const editTransaction = async (req: Request, res: Response) => {
    try{
        const id : string | string[] = req.params.id;

        if (typeof id !== 'string' || !ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid or missing transaction ID" });
        }

        const request:EditTransactionRequestDto = {
            ...req.body
        }

        console.log(id);

        const result = await TransactionService.editTransaction(
            id,
            request.type === "expense" ? "expense" : "income",
            request.name,
            request.amount,
            request.category,
            request.description,
            request.date
        );

        return res.status(201).json({message: "Edit successful."});
    }catch(err: unknown){
        return res.status(500).json({message: "Failed to edit transaction"})
    }
}