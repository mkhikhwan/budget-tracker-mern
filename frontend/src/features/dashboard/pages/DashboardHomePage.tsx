import PageLayout from "../../../shared/layouts/PageLayout";
import styles from "./DashboardHomePage.module.css";
import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import type { BalanceData, PieCategoryData, MonthlyGraphData, Transaction } from "../Dashboard.types";
import * as DashboardAPI from "../Dashboard.api";
import * as DashboardMap from "../Dashboard.mapper";
import FormatCurrency from "../../../shared/helpers/FormatCurrency";

function DashboardHomePage(){
    // Declare states here
    const [balance, setBalance] = useState<BalanceData>({ total: 0, monthlyIncome: 0, monthlyExpense: 0 });
    const [pieData, setPieData] = useState<PieCategoryData[]>([]);
    const [graphData, setGraphData] = useState<MonthlyGraphData[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [allowanceLimit] = useState({ spent: 1200, limit: 2000 });

    // Balance Summary
    const fetchBalanceSummary = async () =>{
        try {
            const res = await DashboardAPI.getBalanceSummary();
            const data = await DashboardMap.mapBalanceToUI(res);
            setBalance(data);
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : "Failed to fetch balance summary");
        }
    }

    const fetchSpendingByCategory = async () => {
        try {
            const res = await DashboardAPI.getExpenseBreakdown();
            const data = await DashboardMap.mapExpenseBreakdownToUI(res);
            setPieData(data);
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : "Failed to fetch spending by category");
        }
    }

    const fetchMonthlySpendingTrend = async () => {
        try {
            const res = await DashboardAPI.getMonthlyExpenses();
            const data = await DashboardMap.mapMonthlyExpensesToUI(res);
            setGraphData(data);
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : "Failed to fetch monthly spending trend");
        }
    }

    const fetchRecentTransactions = async () => {
        try {
            const res = await DashboardAPI.getLatestTransactions()
            const data = await DashboardMap.mapTransactionsToUI(res);
            setTransactions(data);
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : "Failed to fetch recent transactions");
        }
    }

    useEffect(() => {
        const initDashboard = async () => {
            try {
                await Promise.all([
                    fetchBalanceSummary(),
                    fetchSpendingByCategory(),
                    fetchMonthlySpendingTrend(),
                    fetchRecentTransactions()
                ]);
            } catch (error) {
                alert(error instanceof Error ? error.message : "An unexpected error occurred");
            }
        };
        initDashboard();
    }, []);
    
    return (
        <PageLayout header="DashBoard">
            <div className={styles.container}>
                {/* Summary & Actions Header */}
                <div className={styles.headerActions}>
                    <div className={`${styles.card} ${styles.summaryCard} ${styles.balanceCard}`}>
                        <div className={styles.balanceHeader}>
                            <span className={styles.label}>Total Balance</span>
                            <button className={styles.plusBtn}>
                                <i className="fa-solid fa-plus"></i>
                            </button>
                        </div>
                        <h2 className={styles.value}>{FormatCurrency(balance.total)}</h2>
                    </div>

                    <div className={`${styles.card} ${styles.summaryCard}`}>
                        <span className={styles.label}>Monthly Expense</span>
                        <h2 className={`${styles.value} ${styles.error}`}>-{FormatCurrency(balance.monthlyExpense)}</h2>
                    </div>

                    <div className={`${styles.card} ${styles.summaryCard}`}>
                        <span className={styles.label}>Monthly Income</span>
                        <h2 className={`${styles.value} ${styles.success}`}>+{FormatCurrency(balance.monthlyIncome)}</h2>
                    </div>
                </div>

                {/* Allowance Limit (Edit) */}
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <span className={styles.label}>Allowance Limit (Monthly)</span>
                        <button className={styles.editBtn}>Edit</button>
                    </div>
                    <div className={styles.progressContainer}>
                        <div className={styles.progressBar} style={{ width: `${(allowanceLimit.spent / allowanceLimit.limit) * 100}%` }}></div>
                    </div>
                    <div className={styles.progressInfo}>
                        <span>Spent: {FormatCurrency(allowanceLimit.spent)}</span>
                        <span>Limit: {FormatCurrency(allowanceLimit.limit)}</span>
                    </div>
                </div>

                <div className={styles.chartsGrid}>
                     {/* Expenses Spent in the last x days (Pi Chart) */}
                    <div className={styles.card}>
                        <h3 className={styles.cardTitle}>Spending by Category</h3>
                        <div className={`${styles.chartWrapper} ${styles.expensesCategory}`}>
                            <ResponsiveContainer width="100%" height={250}>
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        innerRadius={40}
                                        outerRadius={120}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#1E1E26', border: '1px solid #33333D', borderRadius: '8px' }}
                                        itemStyle={{ color: '#E0E0E0' }}
                                    />
                                    {/* <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} /> */}
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Expenses Graph by month */}
                    <div className={styles.card}>
                        <h3 className={styles.cardTitle}>Monthly Spending Trend</h3>
                        <div className={styles.chartWrapper}>
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={graphData}>
                                    <XAxis 
                                        dataKey="name" 
                                        stroke="#A0A0AB" 
                                        fontSize={12} 
                                        tickLine={false} 
                                        axisLine={false} 
                                    />
                                    <YAxis 
                                        stroke="#A0A0AB" 
                                        fontSize={12} 
                                        tickLine={false} 
                                        axisLine={false} 
                                        tickFormatter={(val) => `$${val}`}
                                    />
                                    <Tooltip 
                                         cursor={{fill: 'rgba(255,255,255,0.05)'}}
                                         contentStyle={{ backgroundColor: '#1E1E26', border: '1px solid #33333D', borderRadius: '8px' }}
                                         itemStyle={{ color: '#E0E0E0' }}
                                    />
                                    <Bar dataKey="expense" fill="#0078FF" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Last 5 items inserted */}
                <div className={styles.card}>
                    <h3 className={styles.cardTitle}>Recent Transactions</h3>
                    <div className={styles.transactionList}>
                        {transactions.map(tx => (
                            <div key={tx.id} className={styles.transactionItem}>
                                <div className={styles.txInfo}>
                                    <span className={styles.txName}>{tx.name}</span>
                                    <span className={styles.txMeta}>{tx.category} • {tx.date}</span>
                                </div>
                                <div className={`${styles.txAmount} ${tx.amount > 0 ? styles.success : ''}`}>
                                    {tx.amount > 0 ? `+${FormatCurrency(tx.amount)}` : `-${FormatCurrency(Math.abs(tx.amount))}`}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </PageLayout>
    )
}
export default DashboardHomePage;