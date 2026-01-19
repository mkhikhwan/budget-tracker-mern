import './App.css';
import { Route , Routes } from 'react-router-dom';
import AppLayout from '../shared/layouts/AppLayout';
import DashboardHomePage from '../features/dashboard/pages/DashboardHomePage';

function App() {
	return (	
		<Routes>
			<Route element={< AppLayout /> }>
				<Route path="/" element={< DashboardHomePage />} />
			</Route>
		</Routes>
	)
}

export default App
