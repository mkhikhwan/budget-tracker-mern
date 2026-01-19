import './App.css';
import { Route , Routes } from 'react-router-dom';
import AppLayout from '../shared/layouts/AppLayout';
import Dashboard from '../features/dashboard/dashboard';

function App() {
	return (	
		<Routes>
			<Route element={< AppLayout /> }>
				<Route path="/" element={< Dashboard />} />
			</Route>
		</Routes>
	)
}

export default App
