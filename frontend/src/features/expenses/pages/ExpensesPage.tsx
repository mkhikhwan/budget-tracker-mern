import PageLayout from "../../../shared/layouts/PageLayout";
import styles from "./ExpensesPage.module.css"
import Button from "../../../shared/components/Button";

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
    const formatAmount = (value:number)=>{
        return value.toFixed(2);
    };

    return (
        <PageLayout header="Expenses">
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
                        data.map((expense)=>{
                            console.log(typeof expense.amount)
                            return <div className={styles.expenseRow} key={expense.id}>
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
                    <Button type="primary" style={{width:'100%', fontSize:'1.1rem', fontWeight:'600', padding:'8px 0px', margin:'8px 0px'}}>
                        <i className="fa-solid fa-plus" style={{ marginRight: '8px' }}></i>
                        Add Expense
                    </Button>
                </div>
            </section>
        </PageLayout>
    )
}

export default ExpensesPage;