import PageLayout from "../../../shared/layouts/PageLayout";
import styles from "./TransactionPage.module.css"
import Button from "../../../shared/components/Button";
import { useEffect, useRef, useState, useMemo } from "react";
import * as TransactionAPI from "../Transactions.api"
import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
import type { Transaction } from "../Transactions.types";
import { mapGetAllResponseToTransactions } from "../Transactions.mapper";
import FilterTransactionInput from "../components/FilterTransactionInput";
import FormatCurrency from "../../../shared/helpers/FormatCurrency";
import { useSettings } from "../../settings/providers/SettingsProvider";

function TransactionPage(){
    const [searchParams] = useSearchParams();
    const [currentPage, setCurrentPage] = useState<number>(1);
    const navigate = useNavigate();
    const settings = useSettings();
    const currencySymbol = settings?.getCurrency() || '$';

    const [loading, setLoading] = useState<boolean>(false);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [isEmptyFirstPage, setIsEmptyFirstPage] = useState<boolean>(false);
    const sentinelRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const [transactions, setTransactions] = useState<Transaction[]>([]);

    const filters = useMemo(() => ({
        search: searchParams.get("search") || "",
        minAmount: searchParams.get("minAmount") || "",
        maxAmount: searchParams.get("maxAmount") || "",
        startDate: searchParams.get("startDate") || "",
        endDate: searchParams.get("endDate") || "",
        category: searchParams.get("category") || ""
    }), [searchParams]);

    // Reset search state when filters change
    useEffect(() => {
        setTransactions([]);
        setCurrentPage(1);
        setHasMore(true);
        setIsEmptyFirstPage(false);
    }, [filters]);

    useEffect(()=>{
        if (!hasMore) return;

        const fetchTransactions = async ()=>{
            setLoading(true);
            try{
                const res = await TransactionAPI.getAllTransaction(currentPage, filters);
                const newTransactions = mapGetAllResponseToTransactions(res);
                setTransactions(prev => currentPage === 1 ? newTransactions : [...prev, ...newTransactions]);
                if (newTransactions.length === 0) {
                    setHasMore(false);
                    if (currentPage === 1) {
                        setIsEmptyFirstPage(true);
                    }
                }
            }catch(err:unknown){
                alert(`Failed to fetch transactions: ${err instanceof Error ? err.message : String(err)}`);
            }finally{
                setLoading(false);
            }
        }

        fetchTransactions();
    }, [currentPage, filters])

    // track loading state without rebuilding the observer
    const isLoadingRef = useRef(loading);
    useEffect(() => {
        isLoadingRef.current = loading;
    }, [loading]);

    useEffect(()=>{
        if(loading || !hasMore) return;

        const callback: IntersectionObserverCallback = (entries) => {
            const firstEntry = entries[0];

            // only intercept when not loading
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
            if(sentinelRef.current){
                observer.unobserve(sentinelRef.current);
            }
        }
    }, [hasMore, loading]);

    const handleOnClickViewTransaction = (id?: string)=>{
        if(!id) return
        
        navigate("/transactions/view", {
            state: {
                id: id
            }
        });
    };

    const hasActiveFilters = useMemo(() => 
        Object.values(filters).some(val => val !== ""),
    [filters]);

    return (
        <PageLayout header="Transactions">
            <section className={styles.section}>
                
                <FilterTransactionInput initialFilters={filters} />

                <div className={styles.transactionsContainer} ref={containerRef}>
                    {isEmptyFirstPage && (
                        <div className={styles.emptyState}>
                            {hasActiveFilters ? (
                                <>
                                    <i className="fa-solid fa-magnifying-glass"></i>
                                    <h3>No results found</h3>
                                    <p>Try adjusting your filters to find what you're looking for.</p>
                                </>
                            ) : (
                                <>
                                    <i className="fa-solid fa-receipt"></i>
                                    <h3>No transactions yet</h3>
                                    <p>Start tracking your finances by adding your first transaction.</p>
                                </>
                            )}
                        </div>
                    )}
                    {
                        transactions.map((transaction)=>{
                            return <div className={styles.transactionItem} key={transaction._id} onClick={()=> handleOnClickViewTransaction(transaction._id)}>
                                <div className={styles.txInfo}>
                                    <span className={styles.txName}>{transaction.name}</span>
                                    <span className={styles.txMeta}>{transaction.category} • {transaction.date.split('T')[0].split('-').reverse().join('-')}</span>
                                </div>
                                <div className={`${styles.txAmount} ${transaction.type === 'income' ? styles.success : styles.error}`}>
                                    {transaction.type === 'income' ? '+' : '-'} {currencySymbol} {FormatCurrency(transaction.amount)}
                                </div>
                            </div>
                        })
                    }

                    {loading && transactions.length === 0 && (
                        <div className={styles.centeredLoading}>
                            <div className={styles.spinner}>
                                <div className={styles.spinnerCircle}></div>
                                <span>Loading transactions...</span>
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
                                <span>Loading more items...</span>
                            </div>
                        )}
                        {!hasMore && !isEmptyFirstPage && <p className={styles.noMoreData}>No more items to load.</p>}
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
    )
}

export default TransactionPage;