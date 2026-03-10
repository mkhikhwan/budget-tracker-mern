import './App.css';
import { Route , Routes } from 'react-router-dom';
import AppLayout from '../shared/layouts/AppLayout';
import DashboardHomePage from '../features/dashboard/pages/DashboardHomePage';
import TransactionPage from '../features/transactions/pages/TransactionPage';
import AddTransactionPage from '../features/transactions/pages/AddTransactionPage';
import ViewTransactionPage from '../features/transactions/pages/ViewTransactionPage';
import EditTransactionPage from '../features/transactions/pages/EditTransactionPage';

import LoginPage from '../features/auth/pages/LoginPage';
import AuthLayout from '../shared/layouts/AuthLayout';

function App() {
	return (	
		<Routes>
			<Route element={< AuthLayout /> }>
				<Route path="/login" element={< LoginPage />} />
			</Route>
			<Route element={< AppLayout /> }>
				<Route path="/" element={< DashboardHomePage />} />
				<Route path="/dashboard" element={< DashboardHomePage />} />
				<Route path="/transactions" element={< TransactionPage />} />
				<Route path="/transactions/view" element={< ViewTransactionPage />} />
				<Route path="/transactions/add" element={< AddTransactionPage />} />
				<Route path="/transactions/edit" element={< EditTransactionPage />} />
			</Route>
		</Routes>
	)
}

export default App
