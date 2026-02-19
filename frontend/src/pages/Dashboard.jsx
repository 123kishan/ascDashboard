import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import {
    MdTrendingUp, MdStar, MdAccessTime, MdPending
} from 'react-icons/md';
import api from '../api/axios';

export default function Dashboard() {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filteredPlans, setFilteredPlans] = useState([]);
    // Filtered chart data when searching
    const [chartStats, setChartStats] = useState(null);
    const [chartLoading, setChartLoading] = useState(false);

    useEffect(() => { fetchDashboard(); }, []);

    const fetchDashboard = async () => {
        try {
            setLoading(true);
            const res = await api.get('/dashboard/stats');
            setStats(res.data.data);
            setFilteredPlans(res.data.data.activePlans || []);
            setChartStats(res.data.data);
        } catch (err) {
            console.error('Dashboard fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    // Detect cover type from search text, then re-fetch chart data filtered by that type
    const handleSearch = async (val) => {
        setSearch(val);
        if (!stats) return;

        // Filter the Active Plans table
        const trimmed = val.trim().toLowerCase();
        const matched = trimmed
            ? stats.activePlans.filter(p => p.planTitle.toLowerCase().includes(trimmed) || p.scope.toLowerCase().includes(trimmed))
            : stats.activePlans;
        setFilteredPlans(matched);

        // Determine which cover_type to filter chart by
        let coverTypeFilter = '';
        if (trimmed) {
            const matchedScopes = [...new Set(matched.map(p => p.scope))];
            if (matchedScopes.length === 1) {
                coverTypeFilter = matchedScopes[0]; // All matched plans are same scope
            } else if (trimmed.includes('domestic')) {
                coverTypeFilter = 'Domestic';
            } else if (trimmed.includes('international') || trimmed.includes('intl')) {
                coverTypeFilter = 'International';
            }
        }

        // Fetch filtered chart stats from backend
        try {
            setChartLoading(true);
            const params = coverTypeFilter ? `?cover_type=${coverTypeFilter}` : '';
            const res = await api.get(`/dashboard/stats${params}`);
            setChartStats(res.data.data);
        } catch (err) {
            console.error('Chart filter error:', err);
        } finally {
            setChartLoading(false);
        }
    };

    const handleClearSearch = () => {
        setSearch('');
        setFilteredPlans(stats?.activePlans || []);
        setChartStats(stats);
    };

    if (loading) return (
        <div className="loading-spinner"><div className="spinner"></div></div>
    );

    const { stats: s, wallet, recentPayments } = stats || {};
    const cd = chartStats?.chartData;

    const barChartData = [
        { name: 'Active', Domestic: cd?.domestic?.active || 0, International: cd?.international?.active || 0 },
        { name: 'Yet to Active', Domestic: cd?.domestic?.yetToActive || 0, International: cd?.international?.yetToActive || 0 },
        { name: 'Matured', Domestic: cd?.domestic?.matured || 0, International: cd?.international?.matured || 0 },
        { name: 'Pending', Domestic: cd?.domestic?.pending || 0, International: cd?.international?.pending || 0 },
    ];

    // Determine what scope the current search matched (to highlight relevant bar)
    const trimmed = search.trim().toLowerCase();
    const matchedScopes = trimmed
        ? [...new Set(stats?.activePlans?.filter(p => p.planTitle.toLowerCase().includes(trimmed) || p.scope.toLowerCase().includes(trimmed)).map(p => p.scope))]
        : ['Domestic', 'International'];
    const showDomestic = !trimmed || matchedScopes.includes('Domestic');
    const showInternational = !trimmed || matchedScopes.includes('International');

    const formatINR = (n) => `INR ${Number(n).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

    // Stats to show: use chart-filtered stats if searching
    const displayStats = chartStats?.stats || s;

    return (
        <div className="content">
            {/* Search bar */}
            <div className="search-bar-row">
                <input
                    className="search-input"
                    placeholder="Search Covers (e.g. Domestic, Boat Racing, International)"
                    value={search}
                    onChange={e => handleSearch(e.target.value)}
                />
                <button className="btn-clear" onClick={handleClearSearch}>Clear Search</button>
            </div>

            <div className="dashboard-grid">
                {/* LEFT - Chart + Tables */}
                <div className="dashboard-left">
                    {/* Policy Chart Card */}
                    <div className="chart-card">
                        <div className="chart-card-header">
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <input
                                    className="chart-search"
                                    placeholder="Search Covers"
                                    value={search}
                                    onChange={e => handleSearch(e.target.value)}
                                />
                                {chartLoading && <div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }}></div>}
                            </div>
                            <span style={{ color: '#94a3b8', fontSize: '1.1rem', cursor: 'pointer' }}>≡</span>
                        </div>
                        <ResponsiveContainer width="100%" height={260}>
                            <BarChart data={barChartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false}
                                    label={{ value: 'Number of Policies', angle: -90, position: 'insideLeft', fontSize: 11, fill: '#94a3b8', dy: 50 }} />
                                <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 13 }}
                                    formatter={(value, name) => [value, name]}
                                    cursor={{ fill: 'rgba(249,115,22,0.05)' }} />
                                <Legend wrapperStyle={{ fontSize: 13, paddingTop: 12 }} />
                                {showDomestic && (
                                    <Bar dataKey="Domestic" fill="#f97316" radius={[4, 4, 0, 0]}
                                        label={{ position: 'insideTop', fontSize: 11, fill: 'white', fontWeight: 700, dy: 4 }} />
                                )}
                                {showInternational && (
                                    <Bar dataKey="International" fill="#3b82f6" radius={[4, 4, 0, 0]}
                                        label={{ position: 'insideTop', fontSize: 11, fill: 'white', fontWeight: 700, dy: 4 }} />
                                )}
                            </BarChart>
                        </ResponsiveContainer>
                        <div style={{ textAlign: 'center', fontSize: '0.78rem', color: '#94a3b8', marginTop: '4px' }}>
                            Policy Status
                            {search.trim() && (
                                <span style={{ marginLeft: 8, color: '#f97316', fontWeight: 600 }}>
                                    · Filtered: "{search}"
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Active Plans Table */}
                    <div className="table-card">
                        <div className="table-card-header">
                            <span className="table-card-title">
                                Active Plans
                                {search.trim() && filteredPlans.length !== stats?.activePlans?.length && (
                                    <span style={{ fontSize: '0.8rem', color: '#f97316', fontWeight: 500, marginLeft: 8 }}>
                                        ({filteredPlans.length} of {stats?.activePlans?.length} shown)
                                    </span>
                                )}
                            </span>
                            <button className="view-all-btn" onClick={() => navigate('/issuance/all')}>View all</button>
                        </div>
                        <div className="table-wrap">
                            <table>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Plan Title</th>
                                        <th>Scope</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredPlans.length > 0 ? filteredPlans.map((plan, i) => (
                                        <tr key={plan._id}>
                                            <td>{i + 1}</td>
                                            <td>{plan.planTitle}</td>
                                            <td>
                                                <span style={{
                                                    padding: '2px 8px',
                                                    background: plan.scope === 'Domestic' ? '#fff7ed' : '#eff6ff',
                                                    color: plan.scope === 'Domestic' ? '#f97316' : '#3b82f6',
                                                    borderRadius: 6, fontSize: '0.78rem', fontWeight: 600
                                                }}>
                                                    {plan.scope}
                                                </span>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan={3} className="empty-state">No plans match "{search}"</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Payment History Table */}
                    <div className="table-card">
                        <div className="table-card-header">
                            <span className="table-card-title">Payment History</span>
                            <button className="view-all-btn" onClick={() => navigate('/operator/payments')}>View all</button>
                        </div>
                        <div className="table-wrap">
                            <table>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Transaction ID</th>
                                        <th>Total Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentPayments?.length > 0 ? recentPayments.map((p, i) => (
                                        <tr key={p._id}>
                                            <td>{i + 1}</td>
                                            <td style={{ fontFamily: 'monospace', fontSize: '0.82rem' }}>{p.transactionId}</td>
                                            <td style={{ fontWeight: 600 }}>₹{p.totalAmount}</td>
                                        </tr>
                                    )) : <tr><td colSpan={3} className="empty-state">No payments</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* RIGHT - Wallet + Stats */}
                <div className="dashboard-right">
                    {/* Wallet Card */}
                    <div className="wallet-card">
                        <div className="wallet-label">Wallet</div>
                        <div className="wallet-sublabel">Available Balance</div>
                        <div className="wallet-amount">{formatINR(wallet?.balance || 0)}</div>
                    </div>

                    {/* Stats Grid - updates with search filter */}
                    <div className="stats-grid">
                        <div className="stat-card stat-active">
                            <div className="stat-card-bar"></div>
                            <div className="stat-card-header">
                                <span className="stat-card-label">Active</span>
                                <div className="stat-card-icon" style={{ background: '#dcfce7' }}>
                                    <MdTrendingUp style={{ color: '#22c55e' }} />
                                </div>
                            </div>
                            <div className="stat-card-value">{displayStats?.active ?? 0}</div>
                        </div>

                        <div className="stat-card stat-yet">
                            <div className="stat-card-bar"></div>
                            <div className="stat-card-header">
                                <span className="stat-card-label">Yet to Active</span>
                                <div className="stat-card-icon" style={{ background: '#fce7f3' }}>
                                    <MdStar style={{ color: '#fb7185' }} />
                                </div>
                            </div>
                            <div className="stat-card-value">{displayStats?.yetToActive ?? 0}</div>
                        </div>

                        <div className="stat-card stat-matured">
                            <div className="stat-card-bar"></div>
                            <div className="stat-card-header">
                                <span className="stat-card-label">Matured</span>
                                <div className="stat-card-icon" style={{ background: '#dbeafe' }}>
                                    <MdAccessTime style={{ color: '#60a5fa' }} />
                                </div>
                            </div>
                            <div className="stat-card-value">{displayStats?.matured ?? 0}</div>
                        </div>

                        <div className="stat-card stat-pending">
                            <div className="stat-card-bar"></div>
                            <div className="stat-card-header">
                                <span className="stat-card-label">Pending</span>
                                <div className="stat-card-icon" style={{ background: '#fef9c3' }}>
                                    <MdPending style={{ color: '#f59e0b' }} />
                                </div>
                            </div>
                            <div className="stat-card-value">{displayStats?.pending ?? 0}</div>
                        </div>
                    </div>

                    {/* Filter label */}
                    {search.trim() && (
                        <div style={{ textAlign: 'center', fontSize: '0.8rem', color: '#94a3b8', padding: '0 0.5rem' }}>
                            Showing data for covers matching
                            <strong style={{ color: '#f97316', marginLeft: 4 }}>"{search}"</strong>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
