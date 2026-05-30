import styles from "./TransactionForm.module.css"

import { useState, useEffect } from "react";
import ImagePicker from "./ImagePicker"
import { type TransactionDetails, type Image, type TransactionCategoryOptions } from "../Transactions.types";
import { useNavigate } from "react-router-dom";
import * as TransactionAPI from "../Transactions.api";
import { mapCategoryDtoToTransactionCategory } from "../Transactions.mapper";

interface Props{
    initialData?: TransactionDetails;
    handleSubmit?: (transaction: TransactionDetails, images: Image[]) => void;
    readonly?: boolean;
}

function TransactionForm({ initialData, handleSubmit, readonly}: Props){
    const navigate = useNavigate();

    const [type, setType] = useState<"expense" | "income">("expense");
    const [name, setName] = useState<string>("");
    const [amount, setAmount] = useState<number>(0);
    const [category, setCategory] = useState<string>("food");
    const [description, setDescription] = useState<string>("");
    const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
    
    const [images, setImages] = useState<Image[]>([]);
    const [categoryOptions, setCategoryOption] = useState<TransactionCategoryOptions>([]);

    const handleInternalOnSubmit = async (e:React.FormEvent)=>{
        e.preventDefault();

        const transaction: TransactionDetails = {
            type,
            name,
            amount,
            category,
            description,
            date,
            images
        };

        if(handleSubmit) handleSubmit(transaction, images);
    };

    const title = type === "expense" ? "Expense" : "Income";
    // Validation
    const handleKeyDownAmount = (e: React.KeyboardEvent<HTMLInputElement>) => {
        // Allow control keys (Backspace, Tab, Enter, etc.)
        const allowedControlKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab", "Enter"];
        if (allowedControlKeys.includes(e.key)) {
            if (e.key === "Backspace") {
                e.preventDefault();
                setAmount(prev => Math.floor(prev / 10));
            } else if (e.key === "Delete") {
                e.preventDefault();
                setAmount(0);
            }
            return; // Allow the browser to handle Tab, Enter, etc. normally
        }

        if(e.key >= "0" && e.key <= "9"){
            e.preventDefault();
            setAmount(prev => (prev * 10) + Number(e.key));
            return;
        }

        // Block all other keys (letters, symbols, etc.)
        e.preventDefault();
    }

    const formatCurrency = (value: number):string => {
        return (value/100).toFixed(2);
    }

    const handleOnClickEditTransaction = (e:React.MouseEvent<HTMLButtonElement>)=>{
        e.preventDefault();
        
        if(!initialData?._id) return
        
        navigate("/transactions/edit", {
            state: {
                id: initialData._id
            }
        });
    };

    const handleOnClickDeleteTransaction = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        if (!initialData?._id) return;
        if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;

        try {
            await TransactionAPI.deleteTransaction(initialData._id);
            alert(`${title} deleted successfully.`);
            navigate("/transactions");
        } catch (err: unknown) {
            alert(`Failed to delete transaction: ${err instanceof Error ? err.message : String(err)}`);
        }
    };

    useEffect(()=>{
        const fetchCategoryOptions = async ()=> {
            try{
                const res = await TransactionAPI.getTransactionCategories();
                if (res?.categories) {
                    const options = res.categories.map(mapCategoryDtoToTransactionCategory);
                    setCategoryOption(options);

                    // Set default value on init
                    const firstCategory = options.find(i => i.type === type);
                    if (firstCategory && !initialData) {
                        setCategory(firstCategory.value);
                    }
                }
            }catch{
                alert("Fail to fetch category options.");
            }
        };

        // Execute the fetch
        fetchCategoryOptions();

        if(initialData){
            setType(initialData.type === 'expense' ? 'expense' : 'income');
            setName(initialData.name);
            setAmount(initialData.amount);
            setCategory(initialData.category);
            setDescription(initialData.description || "");
            setDate(initialData.date.split('T')[0]);

            // Transform images from db to UI state
            const initImages = initialData.images?.map((img)=>{
                const newImg: Image = {
                    _id: img._id,
                    url: img.url,
                    isFromDb: true
                }

                return newImg
            }) || [];
            setImages(initImages);
        }
    },[initialData]);

    useEffect(()=>{
        const firstCategory = categoryOptions.find(i => i.type === type);
        if (firstCategory) {
            setCategory(firstCategory.value);
        }
    },[type, categoryOptions]);

    return (
        <form className={styles.form} method="POST" encType="multipart/form-data">
            {!readonly && <div className={styles.formRow}>
                <div className={styles.transactionTypeContainer}>
                    <div className={`${styles.buttonBackground } ${type === "expense" ? styles.expense : styles.income}`}>
                        
                    </div>
                    <div className={`${styles.transactionType} ${styles.expense} ${type === "expense" ? styles.active : ""}`}
                        onClick={()=>setType("expense")}
                    >
                        Expense
                    </div>
                    <div className={`${styles.transactionType} ${styles.income} ${type === "income" ? styles.active : ""}`}
                        onClick={()=>setType("income")}
                    >
                        Income
                    </div>
                </div>
            </div>}
            <div className={styles.formRow}>
                <label className={styles.formLabel}>{title} Name:</label>
                <input className={styles.input} type="text" 
                    onChange={(e)=> setName(e.target.value)} 
                    placeholder={type === "expense" ? "Lunch..." : "Salary..."}
                    value={name}
                    disabled={readonly}
                />
            </div>
            <div className={styles.formRow}>
                <label className={styles.formLabel}>{title} Amount:</label>
                <input className={styles.input} type="text"
                    onKeyDown={(e)=>handleKeyDownAmount(e)}
                    value={formatCurrency(amount)}
                    disabled={readonly}
                />
            </div>
            <div className={styles.formRow}>
                <label className={styles.formLabel}>{title} Category:</label>
                <select className={styles.input} onChange={(e)=> setCategory(e.target.value)} value={category} disabled={readonly}>
                    {
                        categoryOptions.filter(i => i.type === type).map((option)=>{
                            return <option value={option.value} key={option.value}>{option.label}</option>
                        })
                    }
                </select>
            </div>
            <div className={styles.formRow}>
                <label className={styles.formLabel}>Description:</label>
                <textarea className={styles.input} placeholder="Optional details..." rows={3}
                    onChange={(e)=> setDescription(e.target.value)}
                    value={description}
                    disabled={readonly}
                ></textarea>
            </div>
            <div className={styles.formRow}>
                <label className={styles.formLabel}>Date:</label>
                <input 
                    className={styles.input}
                    type="date" 
                    onChange={(e)=> setDate(e.target.value)}
                    value={date}
                    disabled={readonly}
                />
            </div>
            <div className={styles.formRow}>
                <label className={styles.formLabel}>Images:</label>
                <ImagePicker images={images} setImages={setImages} readonly={readonly}/>
            </div>

            {
                !readonly ?
                (
                    <div className={styles.formRow}>
                        <button 
                            className={`${styles.actionButton} bg-primary`}
                            onClick={handleInternalOnSubmit}
                        >
                            <i className="fa-solid fa-floppy-disk" style={{ marginRight: '8px' }}></i>
                            Save {title}
                        </button>
                    </div>
                ) :
                (
                    <div className={styles.formRow}>
                        <button className={`${styles.actionButton} bg-warning`} onClick={handleOnClickEditTransaction}>
                            <i className="fa-solid fa-pen-to-square" style={{ marginRight: '8px' }}></i>
                            Edit {title}
                        </button>
                        <button className={`${styles.actionButton} bg-error`} onClick={handleOnClickDeleteTransaction}>
                            <i className="fa-solid fa-trash-can" style={{ marginRight: '8px' }}></i>
                            Delete {title}
                        </button>
                    </div>
                )
            }
        </form>
    )
}

export default TransactionForm