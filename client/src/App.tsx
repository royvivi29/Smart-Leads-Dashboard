import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import CreateLeadPage from './pages/CreateLeadPage';
import LeadDetailPage from './pages/LeadDetailPage';
import EditLeadPage from './pages/EditLeadPage';

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={user ? <Navigate to="/" replace /> : <LoginPage />}
      />
      <Route
        path="/register"
        element={user ? <Navigate to="/" replace /> : <RegisterPage />}
      />

    
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <div className="flex flex-col min-h-screen bg-stone-50 dark:bg-[#0a0a0a] transition-colors duration-300">
              <Navbar />
              <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
                <DashboardPage />
              </main>
            </div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/leads/new"
        element={
          <ProtectedRoute>
            <div className="flex flex-col min-h-screen bg-stone-50 dark:bg-[#0a0a0a] transition-colors duration-300">
              <Navbar />
              <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
                <CreateLeadPage />
              </main>
            </div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/leads/:id"
        element={
          <ProtectedRoute>
            <div className="flex flex-col min-h-screen bg-stone-50 dark:bg-[#0a0a0a] transition-colors duration-300">
              <Navbar />
              <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
                <LeadDetailPage />
              </main>
            </div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/leads/:id/edit"
        element={
          <ProtectedRoute>
            <div className="flex flex-col min-h-screen bg-stone-50 dark:bg-[#0a0a0a] transition-colors duration-300">
              <Navbar />
              <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
                <EditLeadPage />
              </main>
            </div>
          </ProtectedRoute>
        }
      />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
