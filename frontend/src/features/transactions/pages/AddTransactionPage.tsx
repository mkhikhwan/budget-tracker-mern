import PageLayout from "../../../shared/layouts/PageLayout"
import TransactionForm from "../components/TransactionForm";

import * as TransactionApi from "../Transactions.api"

function AddTransactionPage(){
    const handleSubmit = async (formData: FormData)=>{
        try{
            const res = await TransactionApi.addTransaction(formData);
            if(res){
                alert("Transaction added successfully.");
            }
        }catch(err: unknown){
            alert(`Failed to add transaction: ${err instanceof Error ? err.message : String(err)}`);
        }
    }

    return (
        <PageLayout header="Add Transaction">
            <TransactionForm 
                handleSubmit={handleSubmit}
            />
        </PageLayout>
    )
}

export default AddTransactionPage