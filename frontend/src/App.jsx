import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import WalletPage from './pages/WalletPage';
import PaymentsPage from './pages/PaymentsPage';
import OperatorAbout from './pages/OperatorAbout';
import IssuePage from './pages/IssuePage';
import AllPolicies from './pages/AllPolicies';
import ProfileSettings from './pages/ProfileSettings';
import ChangePassword from './pages/ChangePassword';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="operator/about" element={<OperatorAbout />} />
            <Route path="operator/wallet" element={<WalletPage />} />
            <Route path="operator/payments" element={<PaymentsPage />} />
            <Route path="operator/policy-issued" element={<AllPolicies />} />
            <Route path="issuance/issue" element={<IssuePage />} />
            <Route path="issuance/all" element={<AllPolicies />} />
            <Route path="account-settings" element={<ProfileSettings />} />
            <Route path="change-password" element={<ChangePassword />} />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
