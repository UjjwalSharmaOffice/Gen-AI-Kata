import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth/AuthProvider';
import { ProtectedRoute } from './auth/ProtectedRoute';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import AdminInventoryPage from './pages/admin/InventoryPage';
import AdminRequestsPage from './pages/admin/RequestsPage';
import AdminHistoryPage from './pages/admin/HistoryPage';
import EmployeeNewRequestPage from './pages/employee/NewRequestPage';
import EmployeeMyRequestsPage from './pages/employee/MyRequestsPage';
import './index.css';

function HomeRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return user.role === 'ADMIN' ? <Navigate to="/admin/inventory" replace /> : <Navigate to="/employee/request" replace />;
}

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<HomeRedirect />} />

            <Route element={<ProtectedRoute roles={['ADMIN']} />}>
              <Route path="/admin/inventory" element={<AdminInventoryPage />} />
              <Route path="/admin/requests" element={<AdminRequestsPage />} />
              <Route path="/admin/history" element={<AdminHistoryPage />} />
            </Route>

            <Route element={<ProtectedRoute roles={['EMPLOYEE']} />}>
              <Route path="/employee/request" element={<EmployeeNewRequestPage />} />
              <Route path="/employee/requests" element={<EmployeeMyRequestsPage />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}
