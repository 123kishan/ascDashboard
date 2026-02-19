import { useEffect, useState } from 'react';
import { MdSearch, MdAccountBalanceWallet, MdTrendingUp, MdTrendingDown, MdArrowDropUp, MdArrowDropDown } from 'react-icons/md';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const fmt = (n) => Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 });

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

    /* Compute credit/debit summary from all transactions */
    const totalCredit = transactions.filter(t => t.type !== 'DEDUCT').reduce((s, t) => s + t.amount, 0);
    const totalDebit = transactions.filter(t => t.type === 'DEDUCT').reduce((s, t) => s + t.amount, 0);

    return (
        <div className="content">
            {/* ── Page Header ── */}
            <div className="page-header stagger-1">
                <div style={{ flex: 1 }}>
                    <div className="page-title">Wallet</div>
                    <div className="page-subtitle">Manage your balance and view transactions</div>
                </div>
                {user?.operatorCode && (
                    <span className="info-chip orange">Code: {user.operatorCode}</span>
                )}
            </div>

            {/* ── Top row: operator info + wallet card ── */}
            <div className="stagger-2" style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', marginBottom: '1.25rem', alignItems: 'stretch' }}>

                {/* Operator info card */}
                <div className="operator-card" style={{ flex: 1, minWidth: 220 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: '0.75rem' }}>
                        <div className="operator-avatar" style={{ width: 52, height: 52, fontSize: '1.25rem', marginBottom: 0 }}>
                            {(user?.name || 'O')[0].toUpperCase()}
                        </div>
                        <div>
                            <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#0f172a' }}>{user?.name}</div>
                            <span className="info-chip orange" style={{ marginTop: 4 }}>
                                {wallet?.userId?.operatorType || user?.operatorType || 'Domestic'}
                            </span>
                        </div>
                    </div>
                    <div className="section-divider"><span>Contact</span></div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <div className="operator-info-row">📞 {user?.phone || 'Not set'}</div>
                        <div className="operator-info-row">✉️ {user?.email}</div>
                    </div>
                </div>

                {/* Wallet card — premium */}
                <div className="wallet-card stagger-3" style={{ flex: 1, minWidth: 260 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                        <MdAccountBalanceWallet style={{ fontSize: '1.2rem', opacity: .85 }} />
                        <span className="wallet-label" style={{ margin: 0 }}>Available Balance</span>
                    </div>
                    <div className="wallet-shine" />
                    <div className="wallet-amount">₹ {fmt(wallet?.balance)}</div>
                    <div className="wallet-info-row">
                        <div className="wallet-info-pill">
                            <span className="wallet-info-pill-label">Credited</span>
                            <span style={{ fontWeight: 800 }}>₹{fmt(totalCredit)}</span>
                        </div>
                        <div className="wallet-info-pill">
                            <span className="wallet-info-pill-label">Debited</span>
                            <span style={{ fontWeight: 800 }}>₹{fmt(totalDebit)}</span>
                        </div>
                    </div>
                    <div className="wallet-footer" style={{ marginTop: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: .7, fontSize: '0.75rem' }}>
                        <span>{user?.name}</span>
                        <span>{user?.operatorCode}</span>
                    </div>
                </div>

                {/* Transaction count chips */}
                <div className="stagger-4" style={{ display: 'flex', flexDirection: 'column', gap: 10, minWidth: 110 }}>
                    <div className="metric-chip">
                        <span className="metric-chip-value" style={{ color: '#16a34a', display: 'flex', alignItems: 'center' }}>
                            <MdArrowDropUp style={{ fontSize: '1.5rem' }} />{transactions.filter(t => t.type !== 'DEDUCT').length}
                        </span>
                        <span className="metric-chip-label">Credits</span>
                    </div>
                    <div className="metric-chip">
                        <span className="metric-chip-value" style={{ color: '#dc2626', display: 'flex', alignItems: 'center' }}>
                            <MdArrowDropDown style={{ fontSize: '1.5rem' }} />{transactions.filter(t => t.type === 'DEDUCT').length}
                        </span>
                        <span className="metric-chip-label">Debits</span>
                    </div>
                </div>
            </div>

            {/* ── Transactions table ── */}
            <div className="table-card stagger-5">
                <div className="table-card-header">
                    <div>
                        <span className="table-card-title">Wallet Transactions</span>
                        <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: 3 }}>
                            Showing {transactions.length} of {total} records
                        </div>
                    </div>
                    <div style={{ position: 'relative' }}>
                        <MdSearch style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                        <input
                            style={{
                                paddingLeft: 32, padding: '8px 14px 8px 34px',
                                border: '1.5px solid #e2e8f0', borderRadius: 9,
                                fontSize: '0.85rem', background: '#f8fafc',
                                fontFamily: 'Inter,sans-serif', outline: 'none',
                                transition: 'border-color .2s, box-shadow .2s',
                            }}
                            placeholder="Search transactions…"
                            value={search}
                            onFocus={e => { e.target.style.borderColor = '#f97316'; e.target.style.boxShadow = '0 0 0 3px rgba(249,115,22,.15)'; }}
                            onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                            onChange={e => { setSearch(e.target.value); setPage(1); }}
                        />
                    </div>
                </div>

                <div className="table-wrap">
                    <table>
                        <thead>
                            <tr>
                                <th>Amount</th>
                                <th>Transaction #</th>
                                <th>Type</th>
                                <th>Created By</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                /* Skeleton rows */
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="skeleton-row">
                                        <td><span className="skeleton-cell" style={{ width: '80px' }} /></td>
                                        <td><span className="skeleton-cell" style={{ width: '140px' }} /></td>
                                        <td><span className="skeleton-cell" style={{ width: '70px' }} /></td>
                                        <td><span className="skeleton-cell" style={{ width: '100px' }} /></td>
                                        <td><span className="skeleton-cell" style={{ width: '120px' }} /></td>
                                    </tr>
                                ))
                            ) : transactions.length > 0 ? transactions.map((t, i) => (
                                <tr key={i}>
                                    <td className={`amount-cell ${t.type === 'DEDUCT' ? 'amount-negative' : 'amount-positive'}`}>
                                        {t.type === 'DEDUCT' ? '−' : '+'} ₹{t.amount.toFixed(2)}
                                    </td>
                                    <td style={{ fontFamily: 'monospace', fontSize: '0.82rem', color: '#475569' }}>{t.transactionNumber}</td>
                                    <td>
                                        <span className={t.type === 'DEDUCT' ? 'txn-type-deduct' : 'txn-type-credit'}>
                                            {t.type === 'DEDUCT' ? <MdTrendingDown style={{ verticalAlign: 'middle', marginRight: 4 }} /> : <MdTrendingUp style={{ verticalAlign: 'middle', marginRight: 4 }} />}
                                            {t.type}
                                        </span>
                                    </td>
                                    <td style={{ fontSize: '0.86rem' }}>{t.createdBy}</td>
                                    <td style={{ color: '#64748b', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>{formatDate(t.date)}</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5}>
                                        <div className="empty-state">
                                            <div className="empty-state-icon">💳</div>
                                            <div>No transactions found</div>
                                            {search && <div style={{ fontSize: '0.8rem', marginTop: 4, color: '#94a3b8' }}>Try clearing the search</div>}
                                        </div>
                                    </td>
                                </tr>
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
