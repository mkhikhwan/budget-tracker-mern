import './App.css';
import { Route , Routes, useLocation, Navigate } from 'react-router-dom';
import AppLayout from '../shared/layouts/AppLayout';
import DashboardHomePage from '../features/dashboard/pages/DashboardHomePage';
import TransactionPage from '../features/transactions/pages/TransactionPage';
import AddTransactionPage from '../features/transactions/pages/AddTransactionPage';
import ViewTransactionPage from '../features/transactions/pages/ViewTransactionPage';
import EditTransactionPage from '../features/transactions/pages/EditTransactionPage';

import LoginPage from '../features/auth/pages/LoginPage';
import RegisterPage from '../features/auth/pages/RegisterPage';
import AuthLayout from '../shared/layouts/AuthLayout';

import { useAuth } from '../features/auth/providers/AuthProvider';

function App() {
	return (	
		<Routes>
			<Route element={< AuthLayout /> }>
				<Route path="/register" element={< RegisterPage />} />
				<Route path="/login" element={< LoginPage />} />
			</Route>

			
			<Route element={
				<ProtectedRoute>
					< AppLayout />
				</ProtectedRoute>
			}>
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

function ProtectedRoute({children}: { children: React.ReactNode }){
	const { user, loading } = useAuth();
	const location = useLocation();

	if(loading){
		console.log("Loading...");
		return <div style={{ color: 'black' }}>Loading session...</div>
	}

	if(!user){
		console.log("No User Found.");
		return <Navigate to="/login" state={{ from: location }} replace />;
	}

	return <>{children}</>;
}

export default App
