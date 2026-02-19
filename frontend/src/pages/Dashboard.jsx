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
            {/* Page Header */}
            <div className="page-header">
                <div>
                    <div className="page-title">Dashboard</div>
                    <div className="page-subtitle">Overview of your insurance portfolio</div>
                </div>
                <div className="search-bar-row" style={{ marginBottom: 0, marginLeft: 'auto' }}>
                    <input
                        className="search-input"
                        placeholder="Search covers…"
                        value={search}
                        onChange={e => handleSearch(e.target.value)}
                    />
                    {search && <button className="btn-clear" onClick={handleClearSearch}>Clear</button>}
                </div>
            </div>

            <div className="dashboard-grid">
                {/* LEFT - Chart + Tables */}
                <div className="dashboard-left">
                    {/* Policy Chart Card */}
                    <div className="chart-card">
                        <div className="chart-card-header">
                            <div>
                                <div className="chart-card-title">Policy Status Overview</div>
                                <div className="chart-card-subtitle">
                                    {search.trim() ? `Filtered: "${search}"` : 'All cover types'}
                                    {chartLoading && <span style={{ marginLeft: 6, color: '#f97316' }}>· Updating…</span>}
                                </div>
                            </div>
                            <input
                                className="chart-search"
                                placeholder="Search…"
                                value={search}
                                onChange={e => handleSearch(e.target.value)}
                            />
                        </div>
                        <div className="chart-card-inner">
                            <ResponsiveContainer width="100%" height={255}>
                                <BarChart data={barChartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 13, boxShadow: '0 4px 20px rgba(0,0,0,.1)' }}
                                        formatter={(value, name) => [value, name]}
                                        cursor={{ fill: 'rgba(249,115,22,0.05)', borderRadius: 4 }} />
                                    <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
                                    {showDomestic && (
                                        <Bar dataKey="Domestic" fill="#f97316" radius={[5, 5, 0, 0]}
                                            label={{ position: 'insideTop', fontSize: 11, fill: 'white', fontWeight: 700, dy: 4 }} />
                                    )}
                                    {showInternational && (
                                        <Bar dataKey="International" fill="#3b82f6" radius={[5, 5, 0, 0]}
                                            label={{ position: 'insideTop', fontSize: 11, fill: 'white', fontWeight: 700, dy: 4 }} />
                                    )}
                                </BarChart>
                            </ResponsiveContainer>
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
                        <div className="wallet-shine"></div>
                        <div style={{ position: 'relative', zIndex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ fontSize: '0.75rem', opacity: 0.8, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '.08em' }}>ASC360</div>
                                <div className="wallet-label">Wallet</div>
                            </div>
                            <div className="wallet-amount" style={{ textAlign: 'left', marginTop: '1rem', fontSize: '1.6rem' }}>
                                {formatINR(wallet?.balance || 0)}
                            </div>
                            <div className="wallet-footer">
                                <span>Available Balance</span>
                                <span style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,.2)', padding: '2px 8px', borderRadius: 6 }}>₹ INR</span>
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="stats-grid">
                        {[
                            { cls: 'stat-active', label: 'Active', icon: <MdTrendingUp />, color: '#22c55e', val: displayStats?.active ?? 0, sub: 'policies' },
                            { cls: 'stat-yet', label: 'Yet to Active', icon: <MdStar />, color: '#fb7185', val: displayStats?.yetToActive ?? 0, sub: 'pending start' },
                            { cls: 'stat-matured', label: 'Matured', icon: <MdAccessTime />, color: '#60a5fa', val: displayStats?.matured ?? 0, sub: 'completed' },
                            { cls: 'stat-pending', label: 'Pending', icon: <MdPending />, color: '#f59e0b', val: displayStats?.pending ?? 0, sub: 'in review' },
                        ].map(item => (
                            <div key={item.cls} className={`stat-card ${item.cls}`}>
                                <div className="stat-card-header">
                                    <span className="stat-card-label">{item.label}</span>
                                    <div className="stat-card-icon">
                                        <span style={{ color: item.color, fontSize: '1rem' }}>{item.icon}</span>
                                    </div>
                                </div>
                                <div className="stat-card-value">{item.val}</div>
                                <div className="stat-card-trend">{item.sub}</div>
                            </div>
                        ))}
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
