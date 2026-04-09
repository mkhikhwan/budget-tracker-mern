import { apiClient } from "../../shared/api/apiClient";
import type { 
    GetFiveLatestTransactionsResponseDto, 
    GetLatestBalanceResponseDto, 
    GetExpenseBreakdownResponseDto, 
    GetExpensesByMonthResponseDto 
} from "@budget-now/contract";

const BASE_PATH = "/api/dashboard";

export const getLatestTransactions = (): Promise<GetFiveLatestTransactionsResponseDto> => {
    return apiClient<GetFiveLatestTransactionsResponseDto>(`${BASE_PATH}/latest-transactions`);
};

export const getBalanceSummary = (): Promise<GetLatestBalanceResponseDto> => {
    return apiClient<GetLatestBalanceResponseDto>(`${BASE_PATH}/balance`);
};

export const getExpenseBreakdown = (): Promise<GetExpenseBreakdownResponseDto> => {
    return apiClient<GetExpenseBreakdownResponseDto>(`${BASE_PATH}/expense-breakdown`);
};

export const getMonthlyExpenses = (): Promise<GetExpensesByMonthResponseDto> => {
    return apiClient<GetExpensesByMonthResponseDto>(`${BASE_PATH}/monthly-expenses`);
};