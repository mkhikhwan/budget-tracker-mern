import Button from "../../../shared/components/Button"
import styles from "./TransactionForm.module.css"

import { useState, useMemo, useEffect } from "react";
import ImagePicker from "./ImagePicker"
import { type TransactionDetails, type Image } from "../Transactions.types";

interface Props{
    initialData?: TransactionDetails;
    handleSubmit?: (formData: FormData) => void;
    readonly?: boolean;
}

function TransactionForm({ initialData, handleSubmit, readonly}: Props){
    const [type, setType] = useState<"expense" | "income">("expense");
    const [name, setName] = useState<string>("");
    const [amount, setAmount] = useState<number>(0);
    const [category, setCategory] = useState<string>("food");
    const [description, setDescription] = useState<string>("");
    const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
    
    const [images, setImages] = useState<Image[]>([]);

    const handleInternalOnSubmit = async (e:React.FormEvent)=>{
        e.preventDefault();

        const formData = new FormData();
        formData.append("type", type);
        formData.append("name", name);
        formData.append("amount", amount.toString());
        formData.append("category", category);
        formData.append("description", description);
        formData.append("date", date);
        images.forEach((image) => {
            if(image.file){
                formData.append("images", image.file);
            }
        });

        if(handleSubmit) handleSubmit(formData);
    };

    const title = type === "expense" ? "Expense" : "Income";
    const expenseCategory = [
        { value: 'food', label: 'Food' },
        { value: 'utilities', label: 'Utilities' },
        { value: 'others', label: 'Others' }
    ];
    const incomeCategory = [
        { value: 'salary', label: 'Salary' },
        { value: 'others', label: 'Others' }
    ];

    const categoryOption = useMemo(()=>{
        return type === 'expense' ? expenseCategory : incomeCategory; 
    },[type]);

    // Validation
    const handleKeyDownAmount = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if(e.key >= "0" && e.key <= "9"){
            e.preventDefault();
            setAmount(prev => (prev * 10) + Number(e.key));
            return;
        }

        if(e.key === "Backspace"){
            e.preventDefault();
            setAmount(prev => Math.floor(prev/10));
            return;
        }

        if(e.key === "Delete"){
            e.preventDefault();
            setAmount(0);
        }
    }

    const formatCurrency = (value: number):string => {
        return (value/100).toFixed(2);
    }

    useEffect(()=>{
        if(initialData){
            setType(initialData.type === 'expense' ? 'expense' : 'income');
            setName(initialData.name);
            setAmount(initialData.amount);
            setCategory(initialData.category);
            setDescription(initialData.description || "");
            setDate(initialData.date);

            // Transform images from db to UI state
            const initImages = initialData.images?.map((img)=>{
                const newImg: Image = {
                    id: img._id,
                    url: `/uploads/${img.filename}`
                }

                return newImg
            }) || [];
            setImages(initImages);
        }
    },[initialData]);

    return (
        <form className="form" method="POST" encType="multipart/form-data">
            {!readonly && <div className="form-row">
                <div className={styles.transactionTypeContainer}>
                    <div className={`${styles.buttonBackground } ${type === "expense" ? styles.expense : styles.income}`}>
                        
                    </div>
                    <div className={`${styles.transactionType} ${styles.expense}`}
                        onClick={()=>setType("expense")}
                    >
                        Expense
                    </div>
                    <div className={`${styles.transactionType} ${styles.income}`}
                        onClick={()=>setType("income")}
                    >
                        Income
                    </div>
                </div>
            </div>}
            <div className="form-row">
                <label className="form-label">{title} Name:</label>
                <input className="input" type="text" 
                    onChange={(e)=> setName(e.target.value)} 
                    placeholder={type === "expense" ? "Lunch..." : "Salary..."}
                    value={name}
                    disabled={readonly}
                />
            </div>
            <div className="form-row">
                <label className="form-label">{title} Amount:</label>
                <input className="input" type="text"
                    onKeyDown={(e)=>handleKeyDownAmount(e)}
                    value={formatCurrency(amount)}
                    disabled={readonly}
                />
            </div>
            <div className="form-row">
                <label className="form-label">{title} Category:</label>
                <select className="input" onChange={(e)=> setCategory(e.target.value)} value={category} disabled={readonly}>
                    {
                        categoryOption.map((option)=>{
                            return <option value={option.value} key={option.value}>{option.label}</option>
                        })
                    }
                </select>
            </div>
            <div className="form-row">
                <label className="form-label">Description:</label>
                <textarea className="input select" placeholder="Optional details..." rows={3}
                    onChange={(e)=> setDescription(e.target.value)}
                    value={description}
                    disabled={readonly}
                ></textarea>
            </div>
            <div className="form-row">
                <label className="form-label">Date:</label>
                <input 
                    className="input"
                    type="date" 
                    onChange={(e)=> setDate(e.target.value)}
                    value={date}
                    disabled={readonly}
                />
            </div>
            <div className="form-row">
                <label className="form-label">Images:</label>
                <ImagePicker images={images} setImages={setImages} readonly={readonly}/>
            </div>

            {
                !readonly ?
                (
                    <div className="form-row">
                        <Button type="primary" 
                            style={{fontSize:'1.25rem', fontWeight:'600', padding:'8px'}}
                            onClick={handleInternalOnSubmit}
                        >
                            <i className="fa-solid fa-floppy-disk" style={{ marginRight: '8px' }}></i>
                            Save {title}
                        </Button>
                    </div>
                ) :
                (
                    <div className="form-row">
                        <Button type="secondary" 
                            style={{fontSize:'1.25rem', fontWeight:'600', padding:'8px'}}
                            onClick={() => {}}
                        >
                            <i className="fa-solid fa-pen-to-square" style={{ marginRight: '8px' }}></i>
                            Edit {title}
                        </Button>
                    </div>
                )
            }
        </form>
    )
}

export default TransactionForm