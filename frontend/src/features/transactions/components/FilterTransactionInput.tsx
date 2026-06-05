import { useState, useEffect } from "react";
import styles from "./FilterTransactionInput.module.css"
import { useNavigate } from "react-router-dom";

interface FilterProps {
    initialFilters?: {
        search?: string;
        minAmount?: string;
        maxAmount?: string;
        startDate?: string;
        endDate?: string;
        category?: string;
    };
}

function FilterTransactionInput({ initialFilters }: FilterProps) {
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const navigate = useNavigate();

    const [search, setSearch] = useState("");
    const [minAmount, setMinAmount] = useState<string>("");
    const [maxAmount, setMaxAmount] = useState<string>("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [category, setCategory] = useState("");

    useEffect(() => {
        if (initialFilters) {
            setSearch(initialFilters.search || "");
            setMinAmount(initialFilters.minAmount || "");
            setMaxAmount(initialFilters.maxAmount || "");
            setStartDate(initialFilters.startDate || "");
            setEndDate(initialFilters.endDate || "");
            setCategory(initialFilters.category || "");
        }
    }, [initialFilters]);

    const handleApplyFilters = () => {
        const params = new URLSearchParams();
        
        if (search.trim()) params.set("search", search.trim());
        if (minAmount) params.set("minAmount", minAmount);
        if (maxAmount) params.set("maxAmount", maxAmount);
        if (startDate) params.set("startDate", startDate);
        if (endDate) params.set("endDate", endDate);
        if (category) params.set("category", category);

        navigate({
            pathname: "/transactions",
            search: params.toString()
        }, { replace: true });
        setIsPanelOpen(false);
    };

    const handleClearFilters = () => {
        setSearch("");
        setMinAmount("");
        setMaxAmount("");
        setStartDate("");
        setEndDate("");
        setCategory("");
        navigate("/transactions", { replace: true });
        setIsPanelOpen(false);
    };

    const hasActiveFilters = search || minAmount || maxAmount || startDate || endDate || category;

    return (
        <div className={styles.container}>
            <div className={styles.searchBar}>
                <input 
                    type="text"
                    className={styles.search} 
                    placeholder="Search Transactions"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !isPanelOpen) {
                            handleApplyFilters();
                        }
                    }}
                />
                <div className={styles.filterContainer}>
                    <button className={styles.button} onClick={() => setIsPanelOpen(!isPanelOpen)}>
                        <div className={styles.filterButtonContent}>
                            <i className={`fa-solid fa-filter ${styles.filterIcon}`}></i>
                        </div>
                    </button>
                </div>
            </div>

            {isPanelOpen && (
                <div className={styles.filterPanel}>
                    <div className={styles.filterGrid}>
                        <div className={styles.filterGroup}>
                            <label className={styles.label}>Amount Range</label>
                            <div className={styles.inputRow}>
                                <input 
                                    type="number" 
                                    placeholder="Min" 
                                    className={styles.panelInput} 
                                    value={minAmount}
                                    onChange={(e) => setMinAmount(e.target.value)}
                                />
                                <input 
                                    type="number" 
                                    placeholder="Max" 
                                    className={styles.panelInput} 
                                    value={maxAmount}
                                    onChange={(e) => setMaxAmount(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className={styles.filterGroup}>
                            <label className={styles.label}>Date Range</label>
                            <div className={styles.inputRow}>
                                <input 
                                    type="date" 
                                    className={styles.panelInput} 
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                                <input 
                                    type="date" 
                                    className={styles.panelInput} 
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className={styles.filterGroup}>
                            <label className={styles.label}>Category</label>
                            <select 
                                className={styles.panelInput}
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                <option value="">All Categories</option>
                                <option value="food">Food</option>
                                <option value="transport">Transport</option>
                            </select>
                        </div>
                    </div>
                    <div className={styles.filterActions}>
                        <button className={styles.clearButton} onClick={handleClearFilters}>
                            Clear
                        </button>
                        <button className={styles.applyButton} onClick={handleApplyFilters}>Go</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default FilterTransactionInput;