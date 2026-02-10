import { apiClient } from "../../shared/api/apiClient";
import type { Image } from "../../shared/components/form/ImagePicker";

export interface addTransactionDto {
    type: "expense" | "income";
    name: string;
    amount: number;
    category: string;
    description: string;
    date: string
    images : Image[]
}
export function addTransaction(payload:addTransactionDto){
    return apiClient("/api/transaction/add", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}