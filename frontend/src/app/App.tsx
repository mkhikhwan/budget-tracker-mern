import './App.css';
import { Route , Routes } from 'react-router-dom';
import AppLayout from '../shared/layouts/AppLayout';
import DashboardHomePage from '../features/dashboard/pages/DashboardHomePage';
import ExpensesPage from '../features/expenses/pages/ExpensesPage';

function App() {
	return (	
		<Routes>
			<Route element={< AppLayout /> }>
				<Route path="/dashboard" element={< DashboardHomePage />} />
				<Route path="/expenses" element={< ExpensesPage />} />
			</Route>
		</Routes>
	)
}

export default App
