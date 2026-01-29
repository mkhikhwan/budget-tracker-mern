import PageLayout from "../../../shared/layouts/PageLayout";
import styles from "./ExpensesPage.module.css"

const dummyData: Expense[] = [
    {
        id: 1,
        name: "Lunch",
        category: "Food",
        date: "22 Feb 2026",
        amount: 20.00
    },
    {
        id: 2,
        name: "Monthly Rent",
        category: "Housing",
        date: "01 Mar 2026",
        amount: 1200.00
    },
    {
        id: 3,
        name: "Grocery Run",
        category: "Food",
        date: "05 Mar 2026",
        amount: 85.50
    },
    {
        id: 4,
        name: "Gym Membership",
        category: "Health",
        date: "07 Mar 2026",
        amount: 45.00
    },
    {
        id: 5,
        name: "Internet Bill",
        category: "Utilities",
        date: "10 Mar 2026",
        amount: 60.00
    },
    {
        id: 6,
        name: "Movie Tickets",
        category: "Entertainment",
        date: "12 Mar 2026",
        amount: 30.00
    },
    {
        id: 7,
        name: "Coffee",
        category: "Food",
        date: "13 Mar 2026",
        amount: 5.25
    },
    {
        id: 8,
        name: "Gas Refill",
        category: "Transport",
        date: "15 Mar 2026",
        amount: 55.00
    },
    {
        id: 9,
        name: "Birthday Gift",
        category: "Shopping",
        date: "18 Mar 2026",
        amount: 40.00
    },
    {
        id: 10,
        name: "Electricity Bill",
        category: "Utilities",
        date: "21 Mar 2026",
        amount: 95.00
    }
];

interface Expense{
    id: number
    name: string
    category: string
    date: string
    amount: number
}

function ExpensesPage(){
    // TODO: Api call
    const data: Expense[] = dummyData;

    return (
        <PageLayout header="Expenses">
            <div>
                Expenses Buttons
            </div>
            <div>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th className={`${styles.th} ${styles.checkHeader}`}>
                                <input type="checkbox"/>
                            </th>
                            <th className={`${styles.th}`}>Name</th>
                            <th className={`${styles.th}`}>Category</th>
                            <th className={`${styles.th}`}>Date</th>
                            <th className={`${styles.th}`}>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data.map((expense)=>{
                                return <tr key={expense.id}>
                                    <td className={`${styles.td} `}>
                                        <input type="checkbox"/>
                                    </td>
                                    <td className={`${styles.td} `}>{expense.name}</td>
                                    <td className={`${styles.td} `}>{expense.category}</td>
                                    <td className={`${styles.td} `}>{expense.date}</td>
                                    <td className={`${styles.td} `}>{expense.amount}</td>
                                </tr>
                            })
                        }
                    </tbody>
                </table>
            </div>
        </PageLayout>
    )
}

export default ExpensesPage;