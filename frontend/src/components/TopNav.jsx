import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdArrowBack, MdHeadsetMic, MdNotifications, MdPerson, MdSettings, MdAccountBalanceWallet, MdPayment, MdPolicy, MdVpnKey, MdLogout } from 'react-icons/md';
import { useAuth } from '../context/AuthContext';

export default function TopNav() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [dropOpen, setDropOpen] = useState(false);
    const dropRef = useRef(null);

    useEffect(() => {
        const handler = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false); };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const menuItems = [
        { icon: <MdSettings />, label: 'Profile Settings', action: () => navigate('/account-settings') },
        { icon: <MdPolicy />, label: 'Assign Covers', action: () => navigate('/issuance/all') },
        { icon: <MdAccountBalanceWallet />, label: 'Wallet', action: () => navigate('/operator/wallet') },
        { icon: <MdPayment />, label: 'Payment', action: () => navigate('/operator/payments') },
        { icon: <MdPolicy />, label: 'Policy Issued', action: () => navigate('/operator/policy-issued') },
        { icon: <MdVpnKey />, label: 'Change Password', action: () => navigate('/change-password') },
    ];

    return (
        <header className="topnav">
            <button className="topnav-back" onClick={() => navigate(-1)} title="Go back">
                <MdArrowBack />
            </button>

            <div className="topnav-operator">
                <span className="topnav-operator-label">Operator</span>
                <span className="topnav-operator-name">{user?.name || 'Operator'}</span>
            </div>

            <div className="topnav-right">
                <button className="topnav-icon-btn" title="Support"><MdHeadsetMic /></button>
                <button className="topnav-icon-btn" title="Notifications">
                    <MdNotifications />
                    <span className="topnav-badge"></span>
                </button>

                <div className="profile-dropdown-wrapper" ref={dropRef}>
                    <button className="topnav-icon-btn" onClick={() => setDropOpen(o => !o)} title="Profile">
                        <MdPerson />
                    </button>
                    {dropOpen && (
                        <div className="profile-dropdown">
                            <div className="profile-dropdown-header">
                                <div className="profile-dropdown-avatar">{(user?.name || 'O')[0].toUpperCase()}</div>
                                <div>
                                    <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user?.name}</div>
                                    <div className="profile-dropdown-email">{user?.email}</div>
                                </div>
                            </div>
                            {menuItems.map(item => (
                                <div key={item.label} className="profile-dropdown-item" onClick={() => { item.action(); setDropOpen(false); }}>
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
