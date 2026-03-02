import { apiClient } from "../../shared/api/apiClient";

export interface Transaction{
    _id?: string
    name: string
    type: string
    category: string
    date: string
    amount: number
}

export interface TransactionDetails extends Transaction{
    description: string;
    images?: any;
}

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