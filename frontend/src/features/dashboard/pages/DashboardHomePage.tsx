import PageLayout from "../../../shared/layouts/PageLayout";
import styles from "./DashboardHomePage.module.css"

function DashboardHomePage(){
    return (
        <PageLayout header="DashBoard">
            <div className={styles.container}>
                <div className={`${styles.card} ${styles.balance}`}>
                    <div className={styles.cardTitle}>
                        Balance
                    </div>
                    <div className={styles.cardData}>
                        $200.00
                    </div>
                </div> 
                <div className={`${styles.card} ${styles.expense}`}>
                    <div className={styles.cardTitle}>
                        Expense
                    </div>
                    <div className={styles.cardData}>
                        $400.00
                    </div>
                </div> 
                <div className={`${styles.card} ${styles.income}`}>
                    <div className={styles.cardTitle}>
                        Income
                    </div>
                    <div className={styles.cardData}>
                        $600.00
                    </div>
                </div>


                <div className={styles.graphContainer}>
                    <div className={`${styles.card} ${styles.expensesCatagory}`}>Expenses per catagory</div>
                    <div className={`${styles.card} ${styles.monthlyGraph}`}>Monthly spending</div>
                </div>
            </div>
            <div className={styles.transactionHistory}>
                Last update
            </div>
        </PageLayout>
    )
}

export default DashboardHomePage;