import PageLayout from "../../../shared/layouts/PageLayout";
import styles from "./DashboardHomePage.module.css";
import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import type { BalanceData, PieCategoryData, MonthlyGraphData, Transaction } from "../Dashboard.types";
import * as DashboardAPI from "../Dashboard.api";
import * as DashboardMap from "../Dashboard.mapper";
import FormatCurrency from "../../../shared/helpers/FormatCurrency";
import AllowanceCard from "../components/AllowanceCard";
import { useAuth } from "../../auth/providers/AuthProvider";

function DashboardHomePage(){
    const { user } = useAuth();
    const currencySymbol = user?.currency || '$';

    // Declare states here
    const [balance, setBalance] = useState<BalanceData>({ total: 0, monthlyIncome: 0, monthlyExpense: 0 });
    const [pieData, setPieData] = useState<PieCategoryData[]>([]);
    const [graphData, setGraphData] = useState<MonthlyGraphData[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);

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
                        <h2 className={styles.value}>{currencySymbol} {FormatCurrency(balance.total)}</h2>
                    </div>

                    <div className={`${styles.card} ${styles.summaryCard}`}>
                        <span className={styles.label}>Expense (Last 30 Days)</span>
                        <h2 className={`${styles.value} ${styles.error}`}>- {currencySymbol} {FormatCurrency(balance.monthlyExpense)}</h2>
                    </div>

                    <div className={`${styles.card} ${styles.summaryCard}`}>
                        <span className={styles.label}>Income (Last 30 Days)</span>
                        <h2 className={`${styles.value} ${styles.success}`}>+ {currencySymbol} {FormatCurrency(balance.monthlyIncome)}</h2>
                    </div>
                </div>

                {/* Allowance Limit (Edit) */}
                <AllowanceCard />

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
                                        formatter={(val) => `${currencySymbol} ${FormatCurrency(val as number)}`}
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
                                        tickFormatter={(val) => `${currencySymbol} ${FormatCurrency(val)}`}
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
                                <div className={`${styles.txAmount} ${tx.type === 'income' ? 'text-success' : 'text-error'}`}>
                                    {tx.type === 'income' ? '+' : '-'} {currencySymbol} {FormatCurrency(tx.amount)}
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