import { apiClient } from "../../shared/api/apiClient";

export function addTransaction(payload:FormData){
    return apiClient("/api/transaction/add", {
        method: "POST",
        body: payload
    });
}