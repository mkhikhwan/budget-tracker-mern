import { Request, Response } from "express";
import * as DashboardService from "../services/DashboardService";
import { 
    UserTokenPayload,
    GetFiveLatestTransactionsResponseDto,
    GetLatestBalanceResponseDto,
    GetExpenseBreakdownResponseDto,
    GetExpensesByMonthResponseDto
} from "@budget-now/contract";

export const getLatestTransactions = async (req: Request, res: Response) => {
    const user = req.user as UserTokenPayload;
    const result = await DashboardService.getFiveLatestTransactions(user.id);
    
    const response: GetFiveLatestTransactionsResponseDto = {
        transactions: result.map(t => ({
            _id: t._id.toString(),
            type: t.type,
            name: t.name,
            amount: t.amount,
            category: t.category,
            date: t.date,
        }))
    };
    return res.status(200).json(response);
};

export const getBalanceSummary = async (req: Request, res: Response) => {
    const user = req.user as UserTokenPayload;
    const result = await DashboardService.getLatestBalance(user.id);
    
    const response: GetLatestBalanceResponseDto = result;
    return res.status(200).json(response);
};

export const getExpenseBreakdown = async (req: Request, res: Response) => {
    const user = req.user as UserTokenPayload;
    const result = await DashboardService.getExpenseBreakdownByCategory(user.id);
    
    const response: GetExpenseBreakdownResponseDto = {
        breakdown: result.map(item => ({
            _id: item._id.toString(),
            label: item.label,
            value: item.value,
            total: item.total || 0
        }))
    };
    return res.status(200).json(response);
};

export const getMonthlyExpenses = async (req: Request, res: Response) => {
    const user = req.user as UserTokenPayload;
    const year = parseInt(req.query.year as string) || new Date().getFullYear();
    
    const result = await DashboardService.getExpensesByMonth(user.id, year);
    
    const response: GetExpensesByMonthResponseDto = {
        expenses: result
    };
    return res.status(200).json(response);
};