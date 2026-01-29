import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const dummyData = [
    {
        month: 'January',
        amount: 1200,
    },
    {
        month: 'February',
        amount: 950,
    },
    {
        month: 'March',
        amount: 1100,
    },
    {
        month: 'April',
        amount: 1300,
    },
    {
        month: 'May',
        amount: 1050,
    },
    {
        month: 'June',
        amount: 1400,
    },
];

interface MonthlyExpense{
    month: string
    amount: number
}

function MonthlyExpensesComponent(){
    const data: MonthlyExpense[] = dummyData;

    return (
        <ResponsiveContainer>
            <LineChart
                data={data}
                margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
            >
                <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#2a2a2a"
                />

                <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    padding={{ left: 0, right: 0 }}
                    tick={{ fill: "#9ca3af", fontSize: 12 }}
                />

                <YAxis
                    tickLine={false}
                    axisLine={false}
                    width={32}
                    tick={{ fill: "#9ca3af", fontSize: 12 }}
                />

                <Tooltip
                    contentStyle={{
                        backgroundColor: "#111827",
                        border: "none",
                        borderRadius: 8,
                        boxShadow: "0 10px 20px rgba(0,0,0,0.4)",
                        color: "#e5e7eb"
                    }}
                    labelStyle={{ color: "#9ca3af" }}
                    cursor={{ stroke: "#374151", strokeWidth: 1 }}
                />

                <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#3b82f6"
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 5 }}
                />
            </LineChart>
        </ResponsiveContainer>
    )
}

export default MonthlyExpensesComponent