import { useEffect, useState } from 'react';
import { MdPhone, MdEmail, MdBadge } from 'react-icons/md';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function OperatorAbout() {
    const { user } = useAuth();
    const [wallet, setWallet] = useState(null);

    useEffect(() => {
        api.get(`/user-wallet?email=${user?.email}`)
            .then(r => setWallet(r.data.data))
            .catch(console.error);
    }, []);

    return (
        <div className="content">
            <div className="page-header">
                <div>
                    <div className="page-title">Operator Details</div>
                    <div className="page-subtitle">Your operator profile information</div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1.25rem', alignItems: 'start' }}>
                <div className="operator-card">
                    {/* Operator Logo placeholder */}
                    <div style={{ width: 80, height: 80, background: 'linear-gradient(135deg,#f97316,#ea580c)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '1.5rem', marginBottom: '1.25rem' }}>
                        {(user?.name || 'O')[0]}
                    </div>
                    <div className="operator-info">
                        <div style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: 4 }}>{user?.name}</div>
                        <div className="operator-info-row">
                            <span style={{ display: 'inline-block', padding: '3px 10px', background: '#fff7ed', color: '#f97316', borderRadius: 8, fontSize: '0.8rem', fontWeight: 600 }}>
                                {user?.operatorType || 'Domestic'}
                            </span>
                        </div>
                        <div className="operator-info-row"><MdPhone /> {user?.phone || 'Not set'}</div>
                        <div className="operator-info-row"><MdEmail /> {user?.email}</div>
                        <div className="operator-info-row">
                            <MdBadge />
                            <span><strong>Operator Code:</strong> <span style={{ color: '#f97316', fontWeight: 700 }}>{user?.operatorCode}</span></span>
                        </div>
                    </div>
                </div>

                <div className="wallet-card" style={{ minWidth: 240 }}>
                    <div className="wallet-label">Wallet</div>
                    <div className="wallet-sublabel">Available Balance</div>
                    <div className="wallet-amount">INR {Number(wallet?.balance || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
                </div>
            </div>
        </div>
    );
}
