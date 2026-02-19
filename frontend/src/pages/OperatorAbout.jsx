import { useEffect, useState } from 'react';
import { MdPhone, MdEmail, MdBadge, MdVerified, MdAccountBalanceWallet } from 'react-icons/md';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const fmt = (n) => Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 });

export default function OperatorAbout() {
    const { user } = useAuth();
    const [wallet, setWallet] = useState(null);

    useEffect(() => {
        api.get(`/user-wallet?email=${user?.email}`)
            .then(r => setWallet(r.data.data))
            .catch(console.error);
    }, []);

    const operatorType = wallet?.userId?.operatorType || user?.operatorType || 'Domestic';

    return (
        <div className="content">
            {/* ── Page Header ── */}
            <div className="page-header stagger-1">
                <div>
                    <div className="page-title">Operator Details</div>
                    <div className="page-subtitle">Your operator profile and account information</div>
                </div>
                <span className="info-chip green"><MdVerified style={{ fontSize: '0.9rem' }} /> Verified Operator</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: '1.25rem', alignItems: 'start' }}>

                {/* ── Left: Profile card ── */}
                <div className="operator-card stagger-2">
                    {/* Avatar */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.25rem' }}>
                        <div className="operator-avatar">
                            {(user?.name || 'O')[0].toUpperCase()}
                        </div>
                        <div>
                            <div style={{ fontWeight: 800, fontSize: '1.2rem', color: '#0f172a', letterSpacing: '-0.4px' }}>
                                {user?.name}
                            </div>
                            <div style={{ display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
                                <span className={`info-chip ${operatorType === 'International' ? 'blue' : 'orange'}`}>
                                    {operatorType}
                                </span>
                                <span className="info-chip green">Active</span>
                            </div>
                        </div>
                    </div>

                    {/* Operator Code highlight */}
                    <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '14px 18px', borderRadius: 12,
                        background: 'linear-gradient(135deg, #fff7ed 0%, #fff 60%)',
                        border: '1.5px solid #fed7aa', marginBottom: '1.25rem',
                    }}>
                        <div>
                            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.07em' }}>Operator Code</div>
                            <div style={{ fontWeight: 900, fontSize: '1.35rem', color: '#f97316', letterSpacing: 2, marginTop: 2 }}>
                                {user?.operatorCode || '—'}
                            </div>
                        </div>
                        <div style={{
                            width: 44, height: 44, borderRadius: 11,
                            background: 'linear-gradient(135deg,#f97316,#ea580c)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 5px 16px rgba(249,115,22,.35)',
                        }}>
                            <MdBadge style={{ color: 'white', fontSize: '1.4rem' }} />
                        </div>
                    </div>

                    {/* Contact info */}
                    <div className="section-divider"><span>Contact Information</span></div>
                    <div className="operator-info" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <div className="operator-info-row">
                            <MdPhone />
                            <span>{user?.phone || 'Not set'}</span>
                        </div>
                        <div className="operator-info-row">
                            <MdEmail />
                            <span>{user?.email}</span>
                        </div>
                    </div>
                </div>

                {/* ── Right: Wallet + Stats ── */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {/* Premium Wallet card */}
                    <div className="wallet-card stagger-3">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                            <MdAccountBalanceWallet style={{ fontSize: '1.15rem', opacity: .85 }} />
                            <span className="wallet-label" style={{ margin: 0 }}>Wallet</span>
                        </div>
                        <div className="wallet-shine" />
                        <div className="wallet-sublabel">Available Balance</div>
                        <div className="wallet-amount">₹ {fmt(wallet?.balance)}</div>
                        <div className="wallet-footer" style={{ marginTop: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: .7, fontSize: '0.72rem' }}>
                            <span>{user?.name}</span>
                            <span style={{ letterSpacing: 1 }}>{user?.operatorCode}</span>
                        </div>
                    </div>

                    {/* Mini metric chips */}
                    <div className="stagger-4" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                        <div className="metric-chip">
                            <span className="metric-chip-value">
                                {operatorType === 'Both' ? '🌐' : operatorType === 'International' ? '✈️' : '🏠'}
                            </span>
                            <span className="metric-chip-label">{operatorType}</span>
                        </div>
                        <div className="metric-chip">
                            <span className="metric-chip-value" style={{ color: '#22c55e', fontSize: '1rem' }}>●</span>
                            <span className="metric-chip-label">Active</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
