import './App.css';
import { Route , Routes } from 'react-router-dom';
import AppLayout from '../shared/layouts/AppLayout';
import DashboardHomePage from '../features/dashboard/pages/DashboardHomePage';
import TransactionPage from '../features/transactions/pages/TransactionPage';
import AddTransactionPage from '../features/transactions/pages/AddTransactionPage';
import ViewTransactionPage from '../features/transactions/pages/ViewTransactionPage';

function App() {
	return (	
		<Routes>
			<Route element={< AppLayout /> }>
				<Route path="/" element={< DashboardHomePage />} />
				<Route path="/dashboard" element={< DashboardHomePage />} />
				<Route path="/transactions" element={< TransactionPage />} />
				<Route path="/transactions/view" element={< ViewTransactionPage />} />
				<Route path="/transactions/add" element={< AddTransactionPage />} />
			</Route>
		</Routes>
	)
}

export default App
