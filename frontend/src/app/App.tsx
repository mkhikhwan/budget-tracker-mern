import './App.css';
import { Route , Routes } from 'react-router-dom';
import AppLayout from '../shared/layouts/AppLayout';
import DashboardHomePage from '../features/dashboard/pages/DashboardHomePage';
import ExpensesPage from '../features/expenses/pages/ExpensesPage';
import AddExpensePage from '../features/expenses/pages/AddExpensePage';

function App() {
	return (	
		<Routes>
			<Route element={< AppLayout /> }>
				<Route path="/" element={< DashboardHomePage />} />
				<Route path="/dashboard" element={< DashboardHomePage />} />
				<Route path="/expenses" element={< ExpensesPage />} />
				<Route path="/expenses/add" element={< AddExpensePage />} />
			</Route>
		</Routes>
	)
}

export default App
