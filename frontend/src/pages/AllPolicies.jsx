import { useEffect, useState } from 'react';
import { MdSearch } from 'react-icons/md';
import api from '../api/axios';

export default function AllPolicies() {
    const [policies, setPolicies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [coverType, setCoverType] = useState('');
    const [status, setStatus] = useState('');
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const limit = 10;

    useEffect(() => { fetchPolicies(); }, [page, search, coverType, status]);

    const fetchPolicies = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/trip-status/all?page=${page}&limit=${limit}&search=${search}&cover_type=${coverType}&status=${status}`);
            setPolicies(res.data.data);
            setTotal(res.data.total);
        } catch (err) { console.error(err); } finally { setLoading(false); }
    };

    const totalPages = Math.ceil(total / limit);
    const statusBadge = (s) => {
        const map = { Active: 'badge-active', Matured: 'badge-matured', Pending: 'badge-pending', 'Yet to Active': 'badge-yet' };
        return <span className={`badge ${map[s] || 'badge-pending'}`}>{s}</span>;
    };
    const selectStyle = { padding: '8px 12px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: '0.85rem', background: 'white', cursor: 'pointer', fontFamily: 'Inter,sans-serif' };

    return (
        <div className="content">
            <div className="page-header">
                <div>
                    <div className="page-title">All Policies</div>
                    <div className="page-subtitle">{total} total policies</div>
                </div>
            </div>

            <div className="table-card">
                <div className="table-card-header" style={{ flexWrap: 'wrap', gap: '0.75rem' }}>
                    <span className="table-card-title">Policy List</span>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginLeft: 'auto' }}>
                        <div style={{ position: 'relative' }}>
                            <MdSearch style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                            <input style={{ paddingLeft: 32, padding: '8px 12px 8px 32px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: '0.85rem', background: '#f8fafc', fontFamily: 'Inter,sans-serif' }}
                                placeholder="Search covers..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
                        </div>
                        <select style={selectStyle} value={coverType} onChange={e => { setCoverType(e.target.value); setPage(1); }}>
                            <option value="">All Types</option>
                            <option value="Domestic">Domestic</option>
                            <option value="International">International</option>
                        </select>
                        <select style={selectStyle} value={status} onChange={e => { setStatus(e.target.value); setPage(1); }}>
                            <option value="">All Status</option>
                            <option value="Active">Active</option>
                            <option value="Yet to Active">Yet to Active</option>
                            <option value="Matured">Matured</option>
                            <option value="Pending">Pending</option>
                        </select>
                    </div>
                </div>
                <div className="table-wrap">
                    <table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Policy Number</th>
                                <th>Cover Title</th>
                                <th>Type</th>
                                <th>Traveler</th>
                                <th>Premium</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={7}><div className="loading-spinner"><div className="spinner"></div></div></td></tr>
                            ) : policies.length > 0 ? policies.map((p, i) => (
                                <tr key={p._id}>
                                    <td>{(page - 1) * limit + i + 1}</td>
                                    <td style={{ fontFamily: 'monospace', fontSize: '0.78rem' }}>{p.policyNumber}</td>
                                    <td>{p.coverTitle}</td>
                                    <td><span style={{ padding: '2px 8px', background: p.coverType === 'Domestic' ? '#fff7ed' : '#eff6ff', color: p.coverType === 'Domestic' ? '#f97316' : '#3b82f6', borderRadius: 6, fontSize: '0.78rem', fontWeight: 600 }}>{p.coverType}</span></td>
                                    <td><div>{p.travelerName}</div><div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{p.travelerAge}y · {p.travelerGender}</div></td>
                                    <td>₹{p.premium}</td>
                                    <td>{statusBadge(p.status)}</td>
                                </tr>
                            )) : (
                                <tr><td colSpan={7}><div className="empty-state"><div className="empty-state-icon">📋</div>No policies found</div></td></tr>
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
