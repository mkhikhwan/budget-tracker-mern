import TransactionForm from "../components/TransactionForm"
import PageLayout from "../../../shared/layouts/PageLayout";
import LoadingPage from "../../../shared/pages/LoadingPage";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { type TransactionDetails } from "../Transactions.types";
import * as TransactionApi from "../Transactions.api"

function EditTransactionPage(){
    const location = useLocation();
    const transactionId = location.state?.id;
    const [transaction, setTransaction] = useState<TransactionDetails>();

    const [isLoading, setLoading] = useState(true);

    useEffect(()=>{
        setLoading(true);

        const fetch = async ()=>{
            try{
                const res = await TransactionApi.getTransactionDetail(transactionId);
                setTransaction(res);
            }catch(e: unknown){
                alert(e instanceof Error ? e.message : "Can't fetch transactioon details");
            }finally{
                setLoading(false);
            }
        };

        fetch();
    },[]);

    const handleSubmit = async (formData: FormData)=>{
        try{
            const res = await TransactionApi.editTransaction(transactionId, formData);
            if(res){
                alert("Transaction edit successfully.");
            }
        }catch(err: unknown){
            alert(`Failed to add transaction: ${err instanceof Error ? err.message : String(err)}`);
        }
    }

    if(isLoading){
        return <LoadingPage />
    }

    return (
        <PageLayout header="View Transaction">
            <TransactionForm 
                initialData={transaction}
                handleSubmit={handleSubmit}
            />
        </PageLayout>
    )
}

export default EditTransactionPage