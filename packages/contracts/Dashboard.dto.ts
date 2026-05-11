import type { TransactionDto } from "./Transaction.dto";

export interface GetFiveLatestTransactionsResponseDto {
    transactions: Omit<TransactionDto, "description">[];
}

export interface GetLatestBalanceResponseDto {
    totalExpense: number;
    totalIncome: number;
    balance: number;
}

export interface ExpenseBreakdownDto {
    _id: string;
    label: string;
    value: string;
    total: number;
}

export interface GetExpenseBreakdownResponseDto {
    breakdown: ExpenseBreakdownDto[];
}

export interface MonthlyExpenseDto {
    month: string;
    total: number;
}

export interface GetExpensesByMonthResponseDto {
    expenses: MonthlyExpenseDto[];
}

export interface AllowanceDto{
    spent: number;
    limit: number;
    startDate: string | Date;
    restartDays: number;
    isOverlimit: boolean;
}

export interface GetAllowanceResponseDto {
    allowance: AllowanceDto;
}

export interface UpdateAllowanceRequestDto {
    allowance: Pick<AllowanceDto, "limit" | "startDate" | "restartDays">;
}