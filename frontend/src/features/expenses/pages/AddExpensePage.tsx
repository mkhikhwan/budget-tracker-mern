import PageLayout from "../../../shared/layouts/PageLayout"
import Button from "../../../shared/components/Button"

import { useState } from "react";
import ImagePicker, { type Image } from "../../../shared/components/form/ImagePicker"

function AddExpensePage(){
    const [name, setName] = useState("");
    const [category, setCategory] = useState("1");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    
    const [images, setImages] = useState<Image[]>([]);

    const handleSubmission = (e:React.FormEvent)=>{
        e.preventDefault();

        const payload = {
            name,
            category,
            description,
            date,
            images
        }

        console.log(payload);
    };

    return (
        <PageLayout header="Add Expense">
            <form className="form">
                <div className="form-row">
                    <label className="form-label">Expense Name:</label>
                    <input className="input" type="text" 
                        onChange={(e)=> setName(e.target.value)} 
                        placeholder="Afternoon lunch..."
                        value={name}
                    />
                </div>
                <div className="form-row">
                    <label className="form-label">Category:</label>
                    <select className="input" onChange={(e)=> setCategory(e.target.value)} value={category}>
                        <option value="1">Food</option>
                        <option value="2">Utilities</option>
                    </select>
                </div>
                <div className="form-row">
                    <label className="form-label">Description (optional):</label>
                    <textarea className="input select" placeholder="Optional details..." rows={3}
                        onChange={(e)=> setDescription(e.target.value)}
                    >{description}</textarea>
                </div>
                <div className="form-row">
                    <label className="form-label">Date:</label>
                    <input 
                        className="input"
                        type="date" 
                        defaultValue={new Date().toISOString().split('T')[0]}
                        onChange={(e)=> setDate(e.target.value)}
                        value={date}
                    />
                </div>
                <div className="form-row">
                    <label className="form-label">Images (Optional):</label>
                    <ImagePicker images={images} setImages={setImages}/>
                </div>
                <div className="form-row">
                    <Button type="primary" 
                        style={{fontSize:'1.25rem', fontWeight:'600', padding:'8px'}}
                        onClick={handleSubmission}
                    >
                        <i className="fa-solid fa-floppy-disk" style={{ marginRight: '8px' }}></i>
                        Save Expense
                    </Button>
                </div>
            </form>
        </PageLayout>
    )
}

export default AddExpensePage