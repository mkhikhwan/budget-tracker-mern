import styles from "./RecentTransactionList.module.css";
import Button from "../../../shared/components/Button";

const transactions: Transaction[] = [
    {
        name: "Groceries",
        category: "Food",
        amount: -120.5,
        date: "1 Jan 2026"
    },
    {
        name: "Internet Bill",
        category: "Utilities",
        amount: -80.0,
        date: "2 Feb 2026"
    }
]

interface Transaction {
    name: string
    category: string
    amount: number
    date: string
}

interface Props{
    data: Transaction[]
}

function RecentTransactionList({ data }:Props){
    data = transactions;

    return (
        <table className={styles.table}>
            <thead className={styles.thead}>
                <tr>
                    <th className={`${styles.th} ${styles.nameHeader}`}>Name</th>
                    <th className={`${styles.th} ${styles.categoryHeader}`}>Category</th>
                    <th className={`${styles.th} ${styles.amountHeader}`}>Amount</th>
                    <th className={`${styles.th} ${styles.dateHeader}`}>Date</th>
                    <th className={`${styles.th} ${styles.actionHeader}`}>Action</th>
                </tr>
            </thead>
            <tbody>
                {
                    data.map((transaction)=>{
                        return <tr>
                            <td className={`${styles.td} ${styles.nameData}`}>{ transaction.name }</td>
                            <td className={`${styles.td} ${styles.categoryData}`}>{ transaction.category }</td>
                            <td className={`${styles.td} `}>{ transaction.amount }</td>
                            <td className={`${styles.td} `}>{ transaction.date}</td>
                            <td className={`${styles.td} ${styles.quickAction}`}>
                                <Button type="primary">
                                    <i className="fa-solid fa-pen-to-square"></i> Edit
                                </Button>
                                <Button type="danger">
                                    <i className="fa-solid fa-trash"></i> Delete
                                </Button>
                            </td>
                        </tr>
                    })
                }
            </tbody>
        </table>
    )
}

export default RecentTransactionList