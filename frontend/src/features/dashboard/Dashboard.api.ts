import { apiClient } from "../../shared/api/apiClient";
import type { 
    GetFiveLatestTransactionsResponseDto, 
    GetLatestBalanceResponseDto, 
    GetExpenseBreakdownResponseDto, 
    GetExpensesByMonthResponseDto,
    GetAllowanceResponseDto,
    UpdateAllowanceRequestDto
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

export const getAllowance = (): Promise<GetAllowanceResponseDto> => {
    return apiClient<GetAllowanceResponseDto>(`${BASE_PATH}/allowance`);
};

export const updateAllowance = (data: UpdateAllowanceRequestDto): Promise<void> => {
    return apiClient<void>(`${BASE_PATH}/allowance`, {
        method: "POST",
        body: JSON.stringify(data),
    });
};