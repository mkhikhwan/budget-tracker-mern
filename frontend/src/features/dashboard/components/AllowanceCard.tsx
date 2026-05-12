import { useState, useEffect, useCallback } from "react";
import styles from "./AllowanceCard.module.css";
import FormatCurrency from "../../../shared/helpers/FormatCurrency";
import Modal from "../../../shared/components/Modal";
import type { Allowance } from "../Dashboard.types"
import { getAllowance, updateAllowance } from "../Dashboard.api";
import { mapAllowanceToUI } from "../Dashboard.mapper";

function AllowanceCard() {
    const [allowanceInitValue, setAllowanceLimit] = useState<Allowance>({ 
        spent: 0, 
        limit: 0, 
        startDate: new Date().toISOString().split('T')[0], 
        restartDays: 30, 
        isOverlimit: false 
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tempLimit, setTempLimit] = useState(0);
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [restartDays, setRestartDays] = useState(30);

    const fetchAllowance = useCallback(async () => {
        try {
            const data = await getAllowance();
            const mapped = mapAllowanceToUI(data);
            setAllowanceLimit(mapped);
            setTempLimit(mapped.limit);
            setStartDate(mapped.startDate.split('T')[0]);
            setRestartDays(mapped.restartDays);
        } catch (error) {
            console.error("Error fetching allowance:", error);
        }
    }, []);

    useEffect(() => {
        fetchAllowance();
    }, [fetchAllowance]);

    const handleUpdateAllowance = async () => {
        try {
            await updateAllowance({
                allowance: {
                    limit: tempLimit,
                    startDate: startDate,
                    restartDays: restartDays
                }
            });
            await fetchAllowance();
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error updating allowance:", error);
        }
    };

    const handleKeyDownAmount = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const allowedControlKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab", "Enter"];
        
        if (allowedControlKeys.includes(e.key)) {
            if (e.key === "Backspace") {
                e.preventDefault();
                setTempLimit(prev => Math.floor(prev / 10));
            } else if (e.key === "Delete") {
                e.preventDefault();
                setTempLimit(0);
            }
            return;
        }

        if (e.key >= "0" && e.key <= "9") {
            e.preventDefault();
            setTempLimit(prev => (prev * 10) + Number(e.key));
            return;
        }

        e.preventDefault();
    };

    const formatCurrencyLocal = (value: number): string => {
        return (value / 100).toFixed(2);
    };

    const handleCloseModal = () => {
        setTempLimit(allowanceInitValue.limit);
        setStartDate(allowanceInitValue.startDate);
        setRestartDays(allowanceInitValue.restartDays);
        setIsModalOpen(false);
    };

    return (
        <div className={styles.card}>
            <div className={styles.cardHeader}>
                <span className={styles.label}>Allowance Limit</span>
                <button className={styles.editBtn} onClick={() => setIsModalOpen(true)}>Edit</button>
            </div>
            <div className={styles.progressContainer}>
                <div 
                    className={styles.progressBar} 
                    style={{ width: `${allowanceInitValue.limit > 0 ? (allowanceInitValue.spent / allowanceInitValue.limit) * 100 : 0}%` }}
                ></div>
            </div>
            <div className={styles.progressInfo}>
                <span>Spent: {FormatCurrency(allowanceInitValue.spent)}</span>
                <span>Limit: {FormatCurrency(allowanceInitValue.limit)}</span>
            </div>

            <Modal 
                isOpen={isModalOpen} 
                onClose={handleCloseModal} 
                buttons={{
                    onConfirm: { label: "Save", action: handleUpdateAllowance },
                    onClose: { label: "Cancel", action: handleCloseModal }
                }}
                title="Edit Allowance"
            >
                <div>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label className={styles.label} style={{ display: 'block', marginBottom: '0.5rem' }}>Spending limit:</label>
                        <input
                            className="input" 
                            type="text" 
                            value={formatCurrencyLocal(tempLimit)} 
                            onKeyDown={handleKeyDownAmount}
                        />
                    </div>
                    <div>
                        <label className={styles.label} style={{ display: 'block', marginBottom: '0.5rem' }}>Date Start:</label>
                        <input 
                            className="input" 
                            type="date" 
                            value={startDate} 
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>
                    <div style={{ marginTop: '1.5rem' }}>
                        <label className={styles.label} style={{ display: 'block', marginBottom: '0.5rem' }}>Restart every x days:</label>
                        <input 
                            className="input" 
                            type="number" 
                            value={restartDays} 
                            onChange={(e) => setRestartDays(Number(e.target.value))}
                        />
                    </div>
                    
                </div>

                
            </Modal>
        </div>
    );
}

export default AllowanceCard;