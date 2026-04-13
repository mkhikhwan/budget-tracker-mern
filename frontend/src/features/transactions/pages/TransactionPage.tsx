import PageLayout from "../../../shared/layouts/PageLayout";
import styles from "./TransactionPage.module.css"
import Button from "../../../shared/components/Button";
import { useEffect, useState } from "react";
import * as TransactionAPI from "../Transactions.api"
import { NavLink, useNavigate } from "react-router-dom";
import type { Transaction } from "../Transactions.types";
import { mapGetAllResponseToTransactions } from "../Transactions.mapper";

function TransactionPage(){
    const navigate = useNavigate();

    const formatAmount = (value:number)=>{
        return (value / 100).toFixed(2);
    };

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
                <div className={styles.controlRow}>
                    <input type="text" className={styles.search} placeholder="Search Transactions"/>
                    <div style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
                        <Button type="primary">
                            <div style={{padding:'4px', paddingLeft:'16px', paddingRight:'16px'}}>
                                <i className="fa-solid fa-filter" style={{ marginRight: '8px' }}></i>
                                Filter
                            </div>
                        </Button>
                    </div>
                </div>
                <div className={styles.transactionsContainer}>
                    {
                        transactions.map((transaction)=>{
                            return <div className={styles.transactionRow} key={transaction._id} onClick={()=> handleOnClickViewTransaction(transaction._id)}>
                                <div className={styles.transactionRowLeft}>
                                    <div className={styles.name}>
                                        {transaction.name}
                                    </div>
                                    <div className={styles.category}>
                                        <span className={styles.tag}>{transaction.category}</span>
                                    </div>
                                    <div className={styles.date}>
                                        {transaction.date.split('T')[0].split('-').reverse().join('-')}
                                    </div>
                                </div>
                                <div className={styles.transactionRowRight}>
                                    <div className={`${styles.amount} ${ transaction.type === "expense" ? styles.expense : styles.income } `}>
                                        <span>{ transaction.type === "expense" ? "-" : "+" }</span> {formatAmount(transaction.amount)}
                                    </div>
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