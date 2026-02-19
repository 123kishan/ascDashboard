import { useEffect, useState } from 'react';
import { MdSearch } from 'react-icons/md';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function WalletPage() {
    const { user } = useAuth();
    const [wallet, setWallet] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const limit = 15;

    useEffect(() => { fetchWallet(); }, []);
    useEffect(() => { fetchTransactions(); }, [page, search]);

    const fetchWallet = async () => {
        try {
            const res = await api.get(`/user-wallet?email=${user?.email}`);
            setWallet(res.data.data);
        } catch (err) { console.error(err); }
    };

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/user-wallet/transactions?page=${page}&limit=${limit}&search=${search}`);
            setTransactions(res.data.data);
            setTotal(res.data.total);
        } catch (err) { console.error(err); } finally { setLoading(false); }
    };

    const totalPages = Math.ceil(total / limit);
    const formatDate = (d) => new Date(d).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });

    return (
        <div className="content">
            <div className="operator-card" style={{ marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                    <div className="operator-info">
                        <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 4 }}>{user?.name}</div>
                        <div style={{ color: '#64748b', fontSize: '0.875rem' }}>{wallet?.userId?.operatorType || 'Domestic'}</div>
                        <div style={{ color: '#64748b', fontSize: '0.875rem', marginTop: 4 }}>📞 {user?.phone || '-'}</div>
                        <div style={{ color: '#64748b', fontSize: '0.875rem' }}>✉️ {user?.email}</div>
                        <div style={{ marginTop: 8, fontSize: '0.85rem' }}>
                            <strong>Operator Code: </strong>
                            <span style={{ color: '#f97316', fontWeight: 600 }}>{user?.operatorCode}</span>
                        </div>
                    </div>
                    {/* Wallet card */}
                    <div className="wallet-card" style={{ minWidth: 260 }}>
                        <div className="wallet-label">Wallet</div>
                        <div className="wallet-sublabel">Available Balance</div>
                        <div className="wallet-amount">INR {Number(wallet?.balance || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
                    </div>
                </div>
            </div>

            {/* Transaction list */}
            <div className="table-card">
                <div className="table-card-header">
                    <span className="table-card-title">Wallet Transactions</span>
                    <div style={{ position: 'relative' }}>
                        <MdSearch style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                        <input
                            style={{ paddingLeft: 32, padding: '8px 12px 8px 32px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: '0.85rem', background: '#f8fafc', fontFamily: 'Inter,sans-serif' }}
                            placeholder="Search"
                            value={search}
                            onChange={e => { setSearch(e.target.value); setPage(1); }}
                        />
                    </div>
                </div>
                <div className="table-wrap">
                    <table>
                        <thead>
                            <tr>
                                <th>Amount</th>
                                <th>Transaction Number</th>
                                <th>Transaction Type</th>
                                <th>Created By</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={5}><div className="loading-spinner"><div className="spinner"></div></div></td></tr>
                            ) : transactions.length > 0 ? transactions.map((t, i) => (
                                <tr key={i}>
                                    <td className={t.type === 'DEDUCT' ? 'txn-amount-deduct' : 'txn-amount-credit'}>
                                        {t.type === 'DEDUCT' ? '-' : '+'}{t.amount.toFixed(2)}
                                    </td>
                                    <td style={{ fontFamily: 'monospace', fontSize: '0.82rem' }}>{t.transactionNumber}</td>
                                    <td><span className={t.type === 'DEDUCT' ? 'txn-type-deduct' : 'txn-type-credit'}>{t.type}</span></td>
                                    <td>{t.createdBy}</td>
                                    <td style={{ color: '#64748b', fontSize: '0.82rem' }}>{formatDate(t.date)}</td>
                                </tr>
                            )) : (
                                <tr><td colSpan={5}><div className="empty-state"><div className="empty-state-icon">💳</div>No transactions found</div></td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="pagination">
                        <button className="page-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(p => (
                            <button key={p} className={`page-btn ${page === p ? 'active' : ''}`} onClick={() => setPage(p)}>{p}</button>
                        ))}
                        <button className="page-btn" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next →</button>
                    </div>
                )}
            </div>
        </div>
    );
}
