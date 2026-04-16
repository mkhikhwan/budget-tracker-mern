import TransactionForm from "../components/TransactionForm"
import PageLayout from "../../../shared/layouts/PageLayout";
import LoadingPage from "../../../shared/pages/LoadingPage";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { type TransactionDetails } from "../Transactions.types";
import * as TransactionApi from "../Transactions.api";
import { mapGetDetailsResponseToTransactionDetails } from "../Transactions.mapper";
import type { Image } from "../Transactions.types";

function EditTransactionPage(){
    const navigate = useNavigate();
    const location = useLocation();
    const transactionId = location.state?.id;
    const [transaction, setTransaction] = useState<TransactionDetails>();

    const [isLoading, setLoading] = useState(true);

    const fetch = async ()=>{
        try{
            const res = await TransactionApi.getTransactionDetail(transactionId);
            setTransaction(mapGetDetailsResponseToTransactionDetails(res));
        }catch(e: unknown){
            alert(e instanceof Error ? e.message : "Can't fetch transactioon details");
        }finally{
            setLoading(false);
        }
    };

    useEffect(()=>{
        setLoading(true);
        fetch();
    },[]);

    const handleSubmit = async (transaction: TransactionDetails, images: Image[]) => {
        try{
            const editTransactionRes = await TransactionApi.editTransaction({ ...transaction, _id: transactionId} as TransactionDetails);
            if(!editTransactionRes) throw new Error("Something's wrong during editing Transaction.");

            const formData: FormData = new FormData();
            const deleteImageIds:string[] = [];
            if(images){
                images.forEach((image) => {
                    if(image.file){
                        formData.append("images", image.file);
                    }
                    else if(image._id && image.isFromDb && image.isDeleted){
                        deleteImageIds.push(image._id);
                    }
                });
            }

            if(formData.has("images")){
                const addImagesRes = await TransactionApi.addImagesToTransaction(transactionId, formData);
                if(!addImagesRes) throw new Error("Something's wrong during updating images.");
            }

            if(deleteImageIds.length > 0){
                const deleteImagesRes = await TransactionApi.deleteImagesFromTransaction(transactionId, { ids : deleteImageIds });
                if(!deleteImagesRes) throw new Error("Something's wrong during deleting images.");
            }

            alert("Transaction updated successfully.");
            navigate("/transactions/view", { state: { id: transactionId } });
        }catch(err: unknown){
            alert(`Failed to edit transaction: ${err instanceof Error ? err.message : String(err)}`);
        }
    }

    if(isLoading){
        return <LoadingPage />
    }

    return (
        <PageLayout header="Edit Transaction">
            <TransactionForm 
                initialData={transaction}
                handleSubmit={handleSubmit}
            />
        </PageLayout>
    )
}

export default EditTransactionPage