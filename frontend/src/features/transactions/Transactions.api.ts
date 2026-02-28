import { apiClient } from "../../shared/api/apiClient";

export interface Transaction{
    _id?: number
    name: string
    category: string
    date: string
    amount: number
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