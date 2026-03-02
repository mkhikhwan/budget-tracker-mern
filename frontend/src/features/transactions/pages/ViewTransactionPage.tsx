import { useEffect, useState } from "react";
import PageLayout from "../../../shared/layouts/PageLayout";
import TransactionForm from "../components/TransactionForm";
import * as TransactionApi from "../Transactions.api"
import { useLocation } from "react-router-dom";
import LoadingPage from "../../../shared/pages/LoadingPage";

function ViewTransactionPage(){
    const location = useLocation();
    const transactionId = location.state?.id;
    const [transaction, setTransaction] = useState<TransactionApi.TransactionDetails>();

    const [isLoading, setLoading] = useState(true);

    useEffect(()=>{
        setLoading(true);

        const fetch = async ()=>{
            try{
                // Simulate API Call
                await new Promise( (resolve) => setTimeout(resolve,5000) );

                setTransaction({
                    _id: "1",
                    name: "Dummy Transaction lmoa",
                    type: "expense",
                    category: "food",
                    description: "test description",
                    date: new Date().toISOString().split('T')[0],
                    amount: 1000
                });
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