export interface BalanceData {
    total: number;
    monthlyIncome: number;
    monthlyExpense: number;
}

export interface PieCategoryData {
    name: string;
    value: number;
    color: string;
}

export interface MonthlyGraphData {
    name: string;
    expense: number;
}

export interface Transaction {
    id: number | string;
    type: string;
    name: string;
    amount: number;
    category: string;
    date: string;
}

export interface Allowance {
    spent: number;
    limit: number;
    startDate: string;
    restartDays: number;
    isOverlimit: boolean;
}