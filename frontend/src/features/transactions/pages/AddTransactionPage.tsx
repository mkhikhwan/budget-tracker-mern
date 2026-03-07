import PageLayout from "../../../shared/layouts/PageLayout"
import TransactionForm from "../components/TransactionForm";

import * as TransactionApi from "../Transactions.api"
import { mapTransactionToCreateDto } from "../Transactions.mapper";
import type { Image, Transaction } from "../Transactions.types";

function AddTransactionPage(){
    const handleSubmit = async (transaction:Transaction, images:Image[])=>{
        try{
            const addTransactionRes = await TransactionApi.addTransaction(mapTransactionToCreateDto(transaction));

            if(!addTransactionRes) throw new Error("Something's wrong during adding Transaction.");

            const transactionId = addTransactionRes.transactionId;
            if(!transactionId) throw new Error("Something's wrong during adding Transaction.");

            const formData: FormData = new FormData();
            if(images){
                images.forEach((image) => {
                    if(image.file){
                        formData.append("images", image.file);
                    }
                    if(image.isFromDb && image.isDeleted){
                        formData.append("deletedImagesId", image.id);
                    }
                });
            }

            const addImagesRes = await TransactionApi.addImagesToTransaction(transactionId, formData);
            if(!addImagesRes) throw new Error("Something's wrong during adding Transaction.");

            if(addImagesRes && addImagesRes){
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