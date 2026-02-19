import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopNav from '../components/TopNav';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
    const { isAuthenticated } = useAuth();
    if (!isAuthenticated) return <Navigate to="/login" replace />;

    return (
        <div className="layout">
            <Sidebar />
            <div className="main">
                <TopNav />
                <Outlet />
            </div>
        </div>
    );
}
