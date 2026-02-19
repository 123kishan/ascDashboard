import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    MdDashboard, MdPerson, MdReceipt, MdExpandMore, MdAccountBalanceWallet,
    MdPayment, MdPolicy, MdVpnKey, MdLogout
} from 'react-icons/md';
import { useAuth } from '../context/AuthContext';

const navItems = [
    {
        label: 'Dashboard', icon: <MdDashboard />, path: '/dashboard'
    },
    {
        label: 'Operator Details', icon: <MdPerson />, children: [
            { label: 'About', path: '/operator/about' },
            { label: 'Wallet', path: '/operator/wallet' },
            { label: 'Payments', path: '/operator/payments' },
            { label: 'Policy Issued', path: '/operator/policy-issued' },
        ]
    },
    {
        label: 'Issuance', icon: <MdReceipt />, children: [
            { label: 'Issue Policy', path: '/issuance/issue' },
            { label: 'All Policies', path: '/issuance/all' },
        ]
    },
];

export default function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useAuth();
    const [openMenus, setOpenMenus] = useState({ 'Operator Details': true });

    const toggle = (label) => setOpenMenus(o => ({ ...o, [label]: !o[label] }));
    const isActive = (path) => location.pathname === path;
    const isParentActive = (item) => item.children?.some(c => isActive(c.path));

    const handleNav = (path) => navigate(path);

    return (
        <aside className="sidebar">
            <div className="sidebar-logo">
                <div className="sidebar-logo-icon">ASC</div>
                <div className="sidebar-logo-text">ASC360</div>
            </div>

            <nav className="sidebar-nav">
                {navItems.map(item => (
                    <div key={item.label} className="nav-item">
                        {item.children ? (
                            <>
                                <div
                                    className={`nav-link ${isParentActive(item) ? 'active' : ''}`}
                                    onClick={() => toggle(item.label)}
                                >
                                    <span className="nav-icon">{item.icon}</span>
                                    <span>{item.label}</span>
                                    <MdExpandMore className={`nav-arrow ${openMenus[item.label] ? 'open' : ''}`} />
                                </div>
                                {openMenus[item.label] && (
                                    <div className="subnav">
                                        {item.children.map(child => (
                                            <div
                                                key={child.path}
                                                className={`subnav-link ${isActive(child.path) ? 'active' : ''}`}
                                                onClick={() => handleNav(child.path)}
                                            >
                                                <span>•</span>
                                                <span>{child.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div
                                className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
                                onClick={() => handleNav(item.path)}
                            >
                                <span className="nav-icon">{item.icon}</span>
                                <span>{item.label}</span>
                            </div>
                        )}
                    </div>
                ))}
            </nav>

            {/* Logout at bottom */}
            <div style={{ padding: '1rem' }}>
                <div
                    className="nav-link"
                    onClick={logout}
                    style={{ borderRadius: '10px', color: '#ef4444', cursor: 'pointer' }}
                >
                    <MdLogout className="nav-icon" />
                    <span>Logout</span>
                </div>
            </div>
        </aside>
    );
}
