import { apiClient } from "../../shared/api/apiClient";
import { type Transaction, type TransactionDetails } from "./Transactions.types";

export function addTransaction(payload:FormData){
    // TODO: Resolve api call here instead of the component

    return apiClient("/api/transaction/add", {
        method: "POST",
        body: payload
    });
}

export async function getAllTransaction(): Promise<Transaction[]>{
    return apiClient("/api/transaction/", {
        method: "GET"
    });
}

export async function getTransactionDetail(id: string): Promise<TransactionDetails>{
    return apiClient(`/api/transaction/${id}`, {
        method: "GET"
    });
}