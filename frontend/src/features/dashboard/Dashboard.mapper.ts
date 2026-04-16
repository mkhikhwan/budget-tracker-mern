import type { 
    GetFiveLatestTransactionsResponseDto, 
    GetLatestBalanceResponseDto, 
    GetExpenseBreakdownResponseDto, 
    GetExpensesByMonthResponseDto 
} from "@budget-now/contract";
import type { BalanceData, Transaction, PieCategoryData, MonthlyGraphData } from "./Dashboard.types";

export const mapBalanceToUI = (dto: GetLatestBalanceResponseDto): BalanceData => ({
    total: dto.balance,
    monthlyIncome: dto.totalIncome,
    monthlyExpense: dto.totalExpense,
});

export const mapTransactionsToUI = (dto: GetFiveLatestTransactionsResponseDto): Transaction[] => {
    return dto.transactions.map<Transaction>((tx) => {
        const txNew: Transaction = {
            id: tx._id,
            name: tx.name,
            type: tx.type,
            amount: tx.amount,
            category: tx.category,
            date: new Date(tx.date).toLocaleDateString(),
        }

        return txNew
    });
};

export const mapExpenseBreakdownToUI = (dto: GetExpenseBreakdownResponseDto): PieCategoryData[] => {
    const categoryColors: Record<string, string> = {
        "rent_mortgage": "#D32F2F",
        "utilities": "#F57C00",
        "groceries": "#388E3C",
        "dining_out": "#8BC34A",
        "transportation": "#FBC02D",
        "insurance": "#1976D2",
        "medical": "#0097A7",
        "education": "#3F51B5",
        "entertainment": "#7B1FA2",
        "shopping": "#C2185B",
        "subscriptions": "#03A9F4",
        "personal_care": "#EC407A",
        "debt_repayment": "#795548",
        "savings_investment": "#2E7D32",
        "others": "#757575"
    };

    const defaultColor = "#757575";

    return dto.breakdown.map((item) => ({
        name: item.label,
        value: item.total,
        color: categoryColors[item.value] || defaultColor,
    }));
};

export const mapMonthlyExpensesToUI = (dto: GetExpensesByMonthResponseDto): MonthlyGraphData[] => {
    return dto.expenses.map((item) => ({
        name: item.month,
        expense: item.total,
    }));
};