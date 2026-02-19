import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    MdArrowBack, MdHeadsetMic, MdNotifications,
    MdSettings, MdAccountBalanceWallet, MdPayment, MdPolicy, MdVpnKey, MdLogout
} from 'react-icons/md';
import { useAuth } from '../context/AuthContext';

/* Map routes → readable labels for the page pill */
const PAGE_LABELS = {
    '/dashboard': '🏠 Dashboard',
    '/operator/about': '👤 Operator Details',
    '/operator/wallet': '💳 Wallet',
    '/operator/payments': '💰 Payments',
    '/operator/policy-issued': '📋 Policies',
    '/issuance/issue': '✏️ Issue Policy',
    '/issuance/all': '📄 All Policies',
    '/account-settings': '⚙️ Profile Settings',
    '/change-password': '🔒 Change Password',
};

export default function TopNav() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [dropOpen, setDropOpen] = useState(false);
    const dropRef = useRef(null);

    useEffect(() => {
        const handler = (e) => {
            if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const currentPageLabel = PAGE_LABELS[location.pathname] || '📌 Dashboard';

    const menuItems = [
        { icon: <MdSettings />, label: 'Profile Settings', action: () => navigate('/account-settings') },
        { icon: <MdPolicy />, label: 'Assign Covers', action: () => navigate('/issuance/all') },
        { icon: <MdAccountBalanceWallet />, label: 'Wallet', action: () => navigate('/operator/wallet') },
        { icon: <MdPayment />, label: 'Payment', action: () => navigate('/operator/payments') },
        { icon: <MdPolicy />, label: 'Policy Issued', action: () => navigate('/operator/policy-issued') },
        { icon: <MdVpnKey />, label: 'Change Password', action: () => navigate('/change-password') },
    ];

    const initials = (user?.name || 'O').slice(0, 2).toUpperCase();

    return (
        <header className="topnav">
            {/* Back button */}
            <button className="topnav-back" onClick={() => navigate(-1)} title="Go back">
                <MdArrowBack />
            </button>

            {/* Operator info */}
            <div className="topnav-operator">
                <span className="topnav-operator-label">Operator</span>
                <span className="topnav-operator-name">{user?.name || 'Operator'}</span>
            </div>

            {/* Current page pill */}
            <div className="topnav-page-pill">
                {currentPageLabel}
            </div>

            <div className="topnav-right">
                {/* Support */}
                <button className="topnav-icon-btn" title="Support">
                    <MdHeadsetMic />
                </button>

                {/* Notifications */}
                <button className="topnav-icon-btn" title="Notifications">
                    <MdNotifications />
                    <span className="topnav-badge"></span>
                </button>

                {/* Avatar dropdown */}
                <div className="profile-dropdown-wrapper" ref={dropRef}>
                    <button
                        className="topnav-avatar-btn"
                        onClick={() => setDropOpen(o => !o)}
                        title={user?.name}
                    >
                        {initials}
                        <span className="topnav-avatar-online" />
                    </button>

                    {dropOpen && (
                        <div className="profile-dropdown">
                            <div className="profile-dropdown-header">
                                <div className="profile-dropdown-avatar">{initials}</div>
                                <div>
                                    <div style={{ fontSize: '0.875rem', fontWeight: 700 }}>{user?.name}</div>
                                    <div className="profile-dropdown-email">{user?.email}</div>
                                    {user?.operatorCode && (
                                        <div style={{ fontSize: '0.72rem', color: '#f97316', fontWeight: 700, marginTop: 2 }}>
                                            Code: {user.operatorCode}
                                        </div>
                                    )}
                                </div>
                            </div>
                            {menuItems.map(item => (
                                <div
                                    key={item.label}
                                    className="profile-dropdown-item"
                                    onClick={() => { item.action(); setDropOpen(false); }}
                                >
                                    {item.icon}
                                    <span>{item.label}</span>
                                </div>
                            ))}
                            <div className="profile-dropdown-item logout" onClick={logout}>
                                <MdLogout />
                                <span>Logout</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
