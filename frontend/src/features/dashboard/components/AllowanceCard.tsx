import { useState } from "react";
import styles from "./AllowanceCard.module.css";
import FormatCurrency from "../../../shared/helpers/FormatCurrency";
import Modal from "../../../shared/components/Modal";

function AllowanceCard() {
    const [allowanceLimit] = useState({ spent: 1200, limit: 2000 });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tempLimit, setTempLimit] = useState(allowanceLimit.limit);

    const handleUpdateAllowance = () => {
        console.log("Placeholder: Updating allowance limit to", tempLimit);
        setIsModalOpen(false);
    };

    return (
        <div className={styles.card}>
            <div className={styles.cardHeader}>
                <span className={styles.label}>Allowance Limit (Monthly)</span>
                <button className={styles.editBtn} onClick={() => setIsModalOpen(true)}>Edit</button>
            </div>
            <div className={styles.progressContainer}>
                <div className={styles.progressBar} style={{ width: `${(allowanceLimit.spent / allowanceLimit.limit) * 100}%` }}></div>
            </div>
            <div className={styles.progressInfo}>
                <span>Spent: {FormatCurrency(allowanceLimit.spent)}</span>
                <span>Limit: {FormatCurrency(allowanceLimit.limit)}</span>
            </div>

            <Modal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                buttons={{
                    onConfirm: { label: "Save", action: handleUpdateAllowance },
                    onClose: { label: "Cancel", action: () => setIsModalOpen(false) }
                }}
                title="Edit Allowance"
            >
                <div>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label className={styles.label} style={{ display: 'block', marginBottom: '0.5rem' }}>Set your monthly spending limit:</label>
                        <input 
                            className="input" 
                            type="number" 
                            value={tempLimit} 
                            onChange={(e) => setTempLimit(Number(e.target.value))}
                        />
                    </div>
                </div>
            </Modal>
        </div>
    );
}

export default AllowanceCard;