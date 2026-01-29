import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const dummyData = [
    { category: "Rent", amount: 1200 },
    { category: "Food", amount: 450 },
    { category: "Transport", amount: 180 },
    { category: "Utilities", amount: 220 },
    { category: "Entertainment", amount: 150 },
    { category: "Misc", amount: 100 },
];

interface ExpenseCategory{
    category: string,
    amount: number
}

function ExpensesPerCategory(){
    // TODO: Api call
    const data: ExpenseCategory[] = dummyData;

    return (
        <ResponsiveContainer>
            <BarChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#2a2a2a"
                />
                <XAxis
                    dataKey="category"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "#9ca3af", fontSize: 12 }}
                    padding={{ left: 0, right: 0 }}
                />
                <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "#9ca3af", fontSize: 12 }}
                />
                <Tooltip
                    contentStyle={{
                        backgroundColor: "#111827",
                        border: "none",
                        borderRadius: 8,
                        color: "#e5e7eb",
                        fontSize: '16px'
                    }}
                />
                <Bar
                    dataKey="amount"
                    fill="#0078FF"
                    radius={[6, 6, 0, 0]} 
                />
            </BarChart>
        </ResponsiveContainer>
    )
}
ExpensesPerCategory
export default ExpensesPerCategory