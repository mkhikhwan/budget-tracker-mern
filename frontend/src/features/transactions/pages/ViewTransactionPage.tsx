import { useEffect, useState } from "react";
import PageLayout from "../../../shared/layouts/PageLayout";
import TransactionForm from "../components/TransactionForm";
import * as TransactionApi from "../Transactions.api"
import { useLocation } from "react-router-dom";
import LoadingPage from "../../../shared/pages/LoadingPage";
import { type TransactionDetails } from "../Transactions.types";

function ViewTransactionPage(){
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

    if(isLoading){
        return <LoadingPage />
    }

    return (
        <PageLayout header="View Transaction">
            <TransactionForm 
                initialData={transaction}
                readonly={true}
            />
        </PageLayout>
    )
}

export default ViewTransactionPage