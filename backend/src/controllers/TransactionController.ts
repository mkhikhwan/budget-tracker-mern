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
    EditTransactionRequestDto,
    UserTokenPayload,
    GetTransactionCategoriesResponseDto,
    TransactionCategoryDto
} from "@budget-now/contract"
import { Image } from "../models/Image";
import AppError from "../utils/AppError";

export const createTransaction = async (req: Request, res:Response) => {
    try{
        const payload = req.body;
        if(!payload) return res.status(500).json({message: "Failed to create transaction"})

        const { type, name, amount, category, description, date }: CreateTransactionRequestDto = payload;

        const user = req.user as UserTokenPayload
        const userId = user.id;

        const result = await TransactionService.createTransaction(
            userId,
            type,
            name,
            amount,
            category,
            description,
            date
        );

        const response:CreateTransactionResponseDto = {
            transactionId: result.toString()
        }

        return res.status(201).json(response);
    }catch(err: unknown){
        return res.status(500).json({message: "Failed to create transaction"})
    }
};

export const addImages = async (req: Request, res:Response) => {
    const images = req.files as Express.Multer.File[];
    const id : string | string[] = req.params.id;

    if (typeof id !== 'string' || !ObjectId.isValid(id)) {
        throw new AppError("Invalid or missing transaction ID", 400);
    }

    const result = await TransactionService.addImagesToTransaction(id, images);

    return res.status(201).json(result);
};

export const deleteImages = async (req: Request, res:Response) => {
    const response = { ...req.body };
    const ids: string[] = response.ids;

    if (!ids || !Array.isArray(ids)) {
        throw new AppError("Invalid or missing image IDs", 400);
    }

    await TransactionService.deleteImages(ids);
    return res.status(201).json({ status: "success" });
}

export const getAllTransaction = async (req: Request, res:Response) => {
    const user = req.user as UserTokenPayload;
    const userId = user.id;

    const result = await TransactionService.getAllTransaction(userId);
    
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
}

export const getTransactionDetails = async (req: Request, res:Response) => {
    const id : string | string[] = req.params.id;

    if (typeof id !== 'string' || !ObjectId.isValid(id)) {
        throw new AppError("Invalid or missing transaction ID", 400);
    }

    const result = await TransactionService.getTransactionDetails(id);

    const images:ImageDto[] = result.images.map((img: Image) => ({
        _id: img._id?.toString(),
        transactionId: img.transactionId.toString(),
        url: `http://localhost:5000/uploads/${img.filename}`,
    }));

    const response:GetTransactionDetailsResponseDto = {
        _id: result._id!.toString(),
        type: result.type!,
        name: result.name!,
        amount: result.amount!,
        category: result.category!,
        description: result.description!,
        date: new Date(result.date!).toISOString(),
        images: images,
    };

    return res.status(200).json(response);
}

export const editTransaction = async (req: Request, res: Response) => {
    const id : string | string[] = req.params.id;
    const user = req.user as UserTokenPayload;
    const userId = user.id;

    if (typeof id !== 'string' || !ObjectId.isValid(id)) {
        throw new AppError("Invalid or missing transaction ID", 400);
    }

    const request:EditTransactionRequestDto = {
        ...req.body
    }

    const result = await TransactionService.editTransaction(
        userId,
        id,
        request.type === "expense" ? "expense" : "income",
        request.name,
        request.amount,
        request.category,
        request.description,
        request.date
    );

    return res.status(200).json({message: "Edit successful."});
}

export const deleteTransaction = async (req: Request, res: Response) => {
    const id : string | string[] = req.params.id;
    const user = req.user as UserTokenPayload;
    const userId = user.id;

    if (typeof id !== 'string' || !ObjectId.isValid(id)) {
        throw new AppError("Invalid or missing transaction ID", 400);
    }

    await TransactionService.deleteTransaction(userId, id);

    return res.status(200).json({ message: "Transaction deleted successfully" });
}

export const getTransactionCategories = async (req: Request, res: Response) => {
    const categories = await TransactionService.getTransactionCategories();
    const newCategories: TransactionCategoryDto[] = categories.map(tc => ({
        _id: tc._id!.toString(),
        type: tc.type,
        label: tc.label,
        value: tc.value
    }));

    const response: GetTransactionCategoriesResponseDto = { categories: newCategories };
    return res.status(200).json(response);
}