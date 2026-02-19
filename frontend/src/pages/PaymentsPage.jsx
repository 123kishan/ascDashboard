import { useEffect, useState } from 'react';
import { MdSearch } from 'react-icons/md';
import api from '../api/axios';

export default function PaymentsPage() {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const limit = 10;

    useEffect(() => { fetchPayments(); }, [page, search]);

    const fetchPayments = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/user-specific-payments/?page=${page}&limit=${limit}&search=${search}`);
            setPayments(res.data.data);
            setTotal(res.data.total);
        } catch (err) { console.error(err); } finally { setLoading(false); }
    };

    const totalPages = Math.ceil(total / limit);
    const statusBadge = (status) => {
        const map = { Success: 'badge-success', Pending: 'badge-pending', Failed: 'badge-failed' };
        return <span className={`badge ${map[status] || 'badge-pending'}`}>{status}</span>;
    };

    return (
        <div className="content">
            <div className="page-header">
                <div>
                    <div className="page-title">Payments</div>
                    <div className="page-subtitle">All payment transactions · {total} records</div>
                </div>
            </div>

            <div className="table-card">
                <div className="table-card-header">
                    <span className="table-card-title">Transaction History</span>
                    <div style={{ position: 'relative' }}>
                        <MdSearch style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                        <input
                            style={{ paddingLeft: 32, padding: '8px 12px 8px 32px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: '0.85rem', background: '#f8fafc', fontFamily: 'Inter,sans-serif' }}
                            placeholder="Search transactions..."
                            value={search}
                            onChange={e => { setSearch(e.target.value); setPage(1); }}
                        />
                    </div>
                </div>
                <div className="table-wrap">
                    <table>
                        <thead>
                            <tr>
                                <th>Transaction ID</th>
                                <th>Gateway</th>
                                <th>Method</th>
                                <th>Currency</th>
                                <th>Total Amount</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={6}><div className="loading-spinner"><div className="spinner"></div></div></td></tr>
                            ) : payments.length > 0 ? payments.map(p => (
                                <tr key={p._id}>
                                    <td style={{ fontWeight: 700, fontSize: '0.82rem', fontFamily: 'monospace' }}>{p.transactionId}</td>
                                    <td style={{ color: '#64748b' }}>{p.gateway}</td>
                                    <td style={{ color: '#64748b' }}>{p.method}</td>
                                    <td style={{ color: '#3b82f6', fontWeight: 600 }}>{p.currency}</td>
                                    <td style={{ fontWeight: 700 }}>{p.totalAmount}</td>
                                    <td>{statusBadge(p.status)}</td>
                                </tr>
                            )) : (
                                <tr><td colSpan={6}><div className="empty-state"><div className="empty-state-icon">💰</div>No payments found</div></td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {totalPages > 1 && (
                    <div className="pagination">
                        <span style={{ fontSize: '0.8rem', color: '#64748b', marginRight: 'auto' }}>Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total}</span>
                        <button className="page-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
                        {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1).map(p => (
                            <button key={p} className={`page-btn ${page === p ? 'active' : ''}`} onClick={() => setPage(p)}>{p}</button>
                        ))}
                        <button className="page-btn" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next →</button>
                    </div>
                )}
            </div>
        </div>
    );
}
