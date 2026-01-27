import PageLayout from "../../../shared/layouts/PageLayout";
import styles from "./DashboardHomePage.module.css";
import MonthlyExpensesComponent from "../components/MonthlyExpensesComponent";
import CardComponent from "../components/CardComponent";
import ExpensesPerCategory from "../components/ExpensesPerCategory";

function DashboardHomePage(){
    return (
        <PageLayout header="DashBoard">
            <div className={styles.container}>
                <CardComponent title="Balance" className={styles.balance}>
                    $200.00
                </CardComponent>
                <CardComponent title="Expense" className={styles.expense}>
                    $400.00
                </CardComponent>
                <CardComponent title="Income" className={styles.income}>
                    $600.00
                </CardComponent>


                <div className={styles.graphContainer}>
                    <CardComponent title="Expenses per category" className={styles.expensesCategory}>
                        <ExpensesPerCategory />
                    </CardComponent>
                    <CardComponent title="Monthly Expenses" className={styles.monthlyGraph}>
                        <MonthlyExpensesComponent />
                    </CardComponent>
                </div>
            </div>
            <div className={styles.transactionHistory}>
                Last update
            </div>
        </PageLayout>
    )
}

export default DashboardHomePage;