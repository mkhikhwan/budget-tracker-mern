import PageLayout from "../../../shared/layouts/PageLayout";
import styles from "./TransactionPage.module.css";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import type { Transaction } from "../Transactions.types";
import FilterTransactionInput from "../components/FilterTransactionInput";
import FormatCurrency from "../../../shared/helpers/FormatCurrency";
import { useSettings } from "../../settings/providers/SettingsProvider";
import * as TransactionAPI from "../Transactions.api";
import { mapGetAllResponseToTransactions } from "../Transactions.mapper";
import Button from "../../../shared/components/Button";

function SearchTransactionPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const settings = useSettings();
    const currencySymbol = settings?.getCurrency() || '$';

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [isEmptyFirstPage, setIsEmptyFirstPage] = useState<boolean>(false);
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    const sentinelRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const isLoadingRef = useRef(loading);

    useEffect(() => {
        isLoadingRef.current = loading;
    }, [loading]);

    // Reset search state when location state (filters) change
    useEffect(() => {
        setTransactions([]);
        setCurrentPage(1);
        setHasMore(true);
        setIsEmptyFirstPage(false);
    }, [location.state]);
    
    const filters = location.state || {
        search: "",
        minAmount: "",
        maxAmount: "",
        startDate: "",
        endDate: "",
        category: ""
    };

    useEffect(() => {
        if (!hasMore) return;

        const fetchTransactions = async () => {
            setLoading(true);
            try {
                const res = await TransactionAPI.getAllTransaction(currentPage, filters);
                const newTransactions = mapGetAllResponseToTransactions(res);
                
                setTransactions(prev => currentPage === 1 ? newTransactions : [...prev, ...newTransactions]);
                
                if (newTransactions.length === 0) {
                    setHasMore(false);
                    if (currentPage === 1) {
                        setIsEmptyFirstPage(true);
                    }
                }
            } catch (err: unknown) {
                alert(`Failed to fetch transactions: ${err instanceof Error ? err.message : String(err)}`);
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, [currentPage, location.state]);

    useEffect(() => {
        if (loading || !hasMore) return;

        const callback: IntersectionObserverCallback = (entries) => {
            const firstEntry = entries[0];
            if (firstEntry.isIntersecting && !isLoadingRef.current) {
                setCurrentPage(prev => prev + 1);
            }
        };

        const options = {
            root: containerRef.current,
            rootMargin: "200px",
            threshold: 0.1
        };

        const observer = new IntersectionObserver(callback, options);
        if (sentinelRef.current) observer.observe(sentinelRef.current);

        return () => {
            if (sentinelRef.current) {
                observer.unobserve(sentinelRef.current);
            }
        };
    }, [hasMore, loading]);

    const handleOnClickViewTransaction = (id?: string) => {
        if (!id) return;
        navigate("/transactions/view", {
            state: { id: id }
        });
    };

    return (
        <PageLayout header="Search Transactions">
            <section className={styles.section}>
                
                <FilterTransactionInput initialFilters={filters}/>

                <div className={styles.transactionsContainer} ref={containerRef}>
                    {isEmptyFirstPage && (
                        <div className={styles.emptyState}>
                            <i className="fa-solid fa-magnifying-glass"></i>
                            <h3>No results found</h3>
                            <p>Try adjusting your filters to find what you're looking for.</p>
                        </div>
                    )}
                    {transactions.map((transaction) => (
                        <div className={styles.transactionItem} key={transaction._id} onClick={() => handleOnClickViewTransaction(transaction._id)}>
                            <div className={styles.txInfo}>
                                <span className={styles.txName}>{transaction.name}</span>
                                <span className={styles.txMeta}>{transaction.category} • {transaction.date.split('T')[0].split('-').reverse().join('-')}</span>
                            </div>
                            <div className={`${styles.txAmount} ${transaction.type === 'income' ? styles.success : styles.error}`}>
                                {transaction.type === 'income' ? '+' : '-'} {currencySymbol} {FormatCurrency(transaction.amount)}
                            </div>
                        </div>
                    ))}

                    {loading && transactions.length === 0 && (
                        <div className={styles.centeredLoading}>
                            <div className={styles.spinner}>
                                <div className={styles.spinnerCircle}></div>
                                <span>Searching transactions...</span>
                            </div>
                        </div>
                    )}

                    <div 
                        ref={sentinelRef} 
                        className={`${styles.sentinel} ${loading && transactions.length === 0 ? styles.sentinelLoadingEmpty : ''} ${isEmptyFirstPage ? styles.sentinelFinished : ''}`}
                    >
                        {loading && transactions.length > 0 && (
                            <div className={styles.spinner}>
                                <div className={styles.spinnerCircle}></div>
                                <span>Loading more results...</span>
                            </div>
                        )}
                        {!hasMore && !isEmptyFirstPage && <p className={styles.noMoreData}>No more results.</p>}
                    </div>
                </div>
                <div>
                    <NavLink to="/transactions/add">
                        <Button type="primary" style={{width:'100%', fontSize:'1.1rem', fontWeight:'600', padding:'8px 0px', margin:'8px 0px'}}>
                            <i className="fa-solid fa-plus" style={{ marginRight: '8px' }}></i>
                            Add Transaction
                        </Button>
                    </NavLink>
                </div>
            </section>
        </PageLayout>
    );
}

export default SearchTransactionPage;