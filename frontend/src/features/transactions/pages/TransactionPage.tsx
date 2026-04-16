import PageLayout from "../../../shared/layouts/PageLayout";
import styles from "./TransactionPage.module.css"
import Button from "../../../shared/components/Button";
import { useEffect, useState } from "react";
import * as TransactionAPI from "../Transactions.api"
import { NavLink, useNavigate } from "react-router-dom";
import type { Transaction } from "../Transactions.types";
import { mapGetAllResponseToTransactions } from "../Transactions.mapper";
import FilterTransactionInput from "../components/FilterTransactionInput";
import FormatCurrency from "../../../shared/helpers/FormatCurrency";
import { useAuth } from "../../auth/providers/AuthProvider";

function TransactionPage(){
    const navigate = useNavigate();
    const { user } = useAuth();
    const currencySymbol = user?.currency || '$';

    const [transactions, setTransactions] = useState<Transaction[]>([]);

    useEffect(()=>{
        const fetch = async ()=>{
            try{
                const res = await TransactionAPI.getAllTransaction();
                setTransactions(mapGetAllResponseToTransactions(res));
            }catch(err:unknown){
                alert(`Failed to fetch transactions: ${err instanceof Error ? err.message : String(err)}`);
            }
        }

        fetch();
    },[]);

    const handleOnClickViewTransaction = (id?: string)=>{
        if(!id) return
        
        navigate("/transactions/view", {
            state: {
                id: id
            }
        });
    };

    return (
        <PageLayout header="Transactions">
            <section className={styles.section}>
                
                <FilterTransactionInput />

                <div className={styles.transactionsContainer}>
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