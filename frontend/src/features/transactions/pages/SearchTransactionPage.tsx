import PageLayout from "../../../shared/layouts/PageLayout";
import styles from "./TransactionPage.module.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import type { Transaction } from "../Transactions.types";
import FilterTransactionInput from "../components/FilterTransactionInput";

const DUMMY_SEARCH_RESULTS: Transaction[] = [
    {
        _id: "1",
        name: "Apple Store",
        category: "Technology",
        date: "2023-11-01T10:00:00Z",
        type: "expense",
        amount: 150000,
    },
    {
        _id: "2",
        name: "Freelance Project",
        category: "Work",
        date: "2023-11-02T10:00:00Z",
        type: "income",
        amount: 500000,
    },
    {
        _id: "3",
        name: "Starbucks Coffee",
        category: "Food",
        date: "2023-11-03T10:00:00Z",
        type: "expense",
        amount: 550,
    },
    {
        _id: "4",
        name: "Amazon Purchase",
        category: "Shopping",
        date: "2023-11-04T10:00:00Z",
        type: "expense",
        amount: 4520,
    }
];

function SearchTransactionPage() {
    const navigate = useNavigate();
    const location = useLocation();
    
    const filters = location.state || {
        search: "",
        minAmount: "",
        maxAmount: "",
        startDate: "",
        endDate: "",
        category: ""
    };

    const buildQueryString = (params: Record<string, string>) => {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value) searchParams.append(key, value);
        });
        return searchParams.toString();
    };

    const queryString = buildQueryString(filters);

    useEffect(() => {
        console.log("Query String:", queryString);
    }, [queryString]);

    const formatAmount = (value: number) => {
        return (value / 100).toFixed(2);
    };

    const handleOnClickViewTransaction = (id?: string) => {
        if (!id) return;
        navigate("/transactions/view", {
            state: { id: id }
        });
    };

    return (
        <PageLayout header="Search Transactions">
            <section className={styles.section}>
                <div className={styles.controlRow}>
                    <FilterTransactionInput initialFilters={filters}/>
                </div>
                <div className={styles.transactionsContainer}>
                    {DUMMY_SEARCH_RESULTS.map((transaction) => (
                        <div className={styles.transactionRow} key={transaction._id} onClick={() => handleOnClickViewTransaction(transaction._id)}>
                            <div className={styles.transactionRowLeft}>
                                <div className={styles.name}>{transaction.name}</div>
                                <div className={styles.category}>
                                    <span className={styles.tag}>{transaction.category}</span>
                                </div>
                                <div className={styles.date}>
                                    {transaction.date.split('T')[0].split('-').reverse().join('-')}
                                </div>
                            </div>
                            <div className={styles.transactionRowRight}>
                                <div className={`${styles.amount} ${transaction.type === "expense" ? styles.expense : styles.income}`}>
                                    <span>{transaction.type === "expense" ? "-" : "+"}</span> {formatAmount(transaction.amount)}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </PageLayout>
    );
}

export default SearchTransactionPage;