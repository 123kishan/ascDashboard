import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    MdDashboard, MdPerson, MdReceipt, MdExpandMore, MdAccountBalanceWallet,
    MdPayment, MdPolicy, MdLogout
} from 'react-icons/md';
import { useAuth } from '../context/AuthContext';

const navItems = [
    { label: 'Dashboard', icon: <MdDashboard />, path: '/dashboard' },
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
    const { logout, user } = useAuth();
    const [openMenus, setOpenMenus] = useState({ 'Operator Details': true });

    const toggle = (label) => setOpenMenus(o => ({ ...o, [label]: !o[label] }));
    const isActive = (path) => location.pathname === path;
    const isParentActive = (item) => item.children?.some(c => isActive(c.path));
    const handleNav = (path) => navigate(path);

    return (
        <aside className="sidebar">
            {/* Logo */}
            <div className="sidebar-logo">
                <div className="sidebar-logo-icon">ASC</div>
                <div className="sidebar-logo-text">ASC360</div>
                <span className="sidebar-logo-badge">PRO</span>
            </div>

            {/* Nav */}
            <nav className="sidebar-nav">
                <div className="sidebar-section-label">Navigation</div>

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

            {/* Bottom: User + Logout */}
            <div className="sidebar-bottom">
                {/* Mini user info */}
                <div style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '8px 12px', marginBottom: 6,
                    background: 'rgba(255,255,255,.06)', borderRadius: 9,
                }}>
                    <div style={{
                        width: 30, height: 30, borderRadius: '50%',
                        background: 'linear-gradient(135deg,#f97316,#ea580c)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 800, fontSize: '0.75rem', color: 'white', flexShrink: 0,
                    }}>
                        {(user?.name || 'O')[0].toUpperCase()}
                    </div>
                    <div>
                        <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'rgba(255,255,255,.9)', lineHeight: 1.2 }}>{user?.name || 'Operator'}</div>
                        <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,.4)' }}>Active operator</div>
                    </div>
                </div>
                <div className="sidebar-logout" onClick={logout}>
                    <MdLogout className="nav-icon" />
                    <span>Logout</span>
                </div>
            </div>
        </aside>
    );
}
