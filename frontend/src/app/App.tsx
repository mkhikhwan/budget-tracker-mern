import './App.css';
import { Route , Routes, useLocation, Navigate } from 'react-router-dom';
import AppLayout from '../shared/layouts/AppLayout';
import DashboardHomePage from '../features/dashboard/pages/DashboardHomePage';
import AddTransactionPage from '../features/transactions/pages/AddTransactionPage';
import ViewTransactionPage from '../features/transactions/pages/ViewTransactionPage';
import EditTransactionPage from '../features/transactions/pages/EditTransactionPage';
import TransactionPage from '../features/transactions/pages/TransactionPage';
import SettingsPage from '../features/settings/pages/SettingsPage.tsx';

import LoginPage from '../features/auth/pages/LoginPage';
import RegisterPage from '../features/auth/pages/RegisterPage';
import AuthLayout from '../shared/layouts/AuthLayout';

import { useAuth } from '../features/auth/providers/AuthProvider';

function App() {
	return (	
		<Routes>
			<Route element={<PublicRoute>< AuthLayout /> </PublicRoute>}>
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
				<Route path="/settings" element={< SettingsPage />} />
			</Route>
		</Routes>
	)
}

function PublicRoute({children}: { children: React.ReactNode }){
	const { user, loading } = useAuth();

	if(loading){
		return <div style={{ color: 'black' }}>Loading...</div>
	}

	// If user is already logged in, redirect them to dashboard
	if(user){
		return <Navigate to="/dashboard" replace />;
	}

	return <>{children}</>;
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
