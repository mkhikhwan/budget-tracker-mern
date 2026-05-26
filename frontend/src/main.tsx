import { createRoot } from 'react-dom/client'
import './index.css'
import App from './app/App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './features/auth/providers/AuthProvider'
import { SettingsProvider } from './features/settings/providers/SettingsProvider.tsx'

createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <AuthProvider>
            <SettingsProvider>
                <App />
            </SettingsProvider>
        </AuthProvider>
    </BrowserRouter>,
)
