import PageLayout from "../../../shared/layouts/PageLayout";
import styles from "./TransactionPage.module.css"
import Button from "../../../shared/components/Button";
import { useEffect, useState } from "react";
import * as TransactionAPI from "../Transactions.api"
import { NavLink } from "react-router-dom";

function TransactionPage(){
    const formatAmount = (value:number)=>{
        return (value / 100).toFixed(2);
    };

    const [transactions, setTransactions] = useState<TransactionAPI.Transaction[]>([]);
    useEffect(()=>{
        const fetch = async ()=>{
            try{
                const data = await TransactionAPI.getAllTransaction();
                setTransactions(data);
            }catch(err:unknown){
                alert(`Failed to add transaction: ${err instanceof Error ? err.message : String(err)}`);
            }
        }

        fetch();
    },[]);

    return (
        <PageLayout header="Transactions">
            <section className={styles.section}>
                <div className={styles.controlRow}>
                    <input type="text" className={styles.search} placeholder="Search Expenses"/>
                    <div style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
                        <Button type="primary">
                            <div style={{padding:'4px', paddingLeft:'16px', paddingRight:'16px'}}>
                                <i className="fa-solid fa-filter" style={{ marginRight: '8px' }}></i>
                                Filter
                            </div>
                        </Button>
                    </div>
                </div>
                <div className={styles.expensesContainer}>
                    {
                        transactions.map((expense)=>{
                            return <div className={styles.expenseRow} key={expense._id}>
                                <div className={styles.expenseRowLeft}>
                                    <div className={styles.name}>
                                        {expense.name} (<span>{expense.category}</span>)
                                    </div>
                                    <div className={styles.date}>
                                        {expense.date}
                                    </div>
                                </div>
                                <div className={styles.expenseRowRight}>
                                    <div className={styles.amount}>
                                        {formatAmount(expense.amount)}
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
                            Add Expense
                        </Button>
                    </NavLink>
                </div>
            </section>
        </PageLayout>
    )
}

export default TransactionPage;