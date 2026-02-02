import PageLayout from "../../../shared/layouts/PageLayout"
import Button from "../../../shared/components/Button"

function AddExpensePage(){
    return (
        <PageLayout header="Add Expense">
            <form className="form">
                <div className="form-row">
                    <label className="form-label">Expense Name:</label>
                    <input className="input" type="text" placeholder="Afternoon lunch..."/>
                </div>
                <div className="form-row">
                    <label className="form-label">Category:</label>
                    <select className="input">
                        <option value="">Food</option>
                        <option value="">Utilities</option>
                    </select>
                </div>
                <div className="form-row">
                    <label className="form-label">Description (optional):</label>
                    <textarea className="input select" placeholder="Optional details..." rows={3}></textarea>
                </div>
                <div className="form-row">
                    <label className="form-label">Date:</label>
                    <input 
                        className="input"
                        type="date" 
                        defaultValue={new Date().toISOString().split('T')[0]} 
                    />
                </div>
                <div className="form-row">
                    <label className="form-label">Images (Optional):</label>

                </div>
                <div className="form-row">
                    <Button type="primary" style={{fontSize:'1.25rem', fontWeight:'600', padding:'8px'}}>
                        <i className="fa-solid fa-floppy-disk" style={{ marginRight: '8px' }}></i>
                        Save Expense
                    </Button>
                </div>
            </form>
        </PageLayout>
    )
}

export default AddExpensePage