import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const features = [
    { icon: '🛡️', title: 'Secure & Reliable', desc: 'Bank-grade security for all your insurance operations' },
    { icon: '📊', title: 'Real-time Analytics', desc: 'Track policies and performance at a glance' },
    { icon: '⚡', title: 'Instant Issuance', desc: 'Issue domestic & international policies instantly' },
];

/* ------------------------------------------------------------------ */
/* Inline styles — self-contained so no CSS class conflicts            */
/* ------------------------------------------------------------------ */
const S = {
    page: {
        minHeight: '100vh',
        display: 'grid',
        gridTemplateColumns: '1fr 480px',
        fontFamily: "'Inter', sans-serif",
    },
    leftPanel: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '3.5rem',
        gap: '2.5rem',
        background: `
            radial-gradient(ellipse at 20% 50%, rgba(249,115,22,.22) 0%, transparent 55%),
            radial-gradient(ellipse at 85% 15%, rgba(234,88,12,.15) 0%, transparent 50%),
            linear-gradient(160deg, #0b1120 0%, #111827 50%, #0b1120 100%)
        `,
        position: 'relative',
        overflow: 'hidden',
    },
    bgCircle1: {
        position: 'absolute', top: -120, right: -80,
        width: 350, height: 350, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(249,115,22,.12) 0%, transparent 70%)',
        pointerEvents: 'none',
    },
    bgCircle2: {
        position: 'absolute', bottom: -100, left: -60,
        width: 280, height: 280, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(59,130,246,.08) 0%, transparent 70%)',
        pointerEvents: 'none',
    },
    logoRow: { display: 'flex', alignItems: 'center', gap: 14, position: 'relative' },
    logoIcon: {
        width: 50, height: 50, borderRadius: 13,
        background: 'linear-gradient(135deg,#f97316,#ea580c)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 900, fontSize: '1rem', color: 'white', flexShrink: 0,
        boxShadow: '0 8px 24px rgba(249,115,22,.45)',
    },
    logoTitle: { fontWeight: 900, fontSize: '1.5rem', color: 'white', letterSpacing: '-0.5px' },
    logoSub: { fontSize: '0.78rem', color: 'rgba(255,255,255,.4)', fontWeight: 500, marginTop: 3 },
    headline: { position: 'relative' },
    h1: { fontSize: '2.4rem', fontWeight: 900, color: 'white', lineHeight: 1.2, letterSpacing: '-1px', marginBottom: 12 },
    h1Accent: { color: '#fb923c' },
    leadText: { fontSize: '0.92rem', color: 'rgba(255,255,255,.45)', lineHeight: 1.65 },
    featureList: { display: 'flex', flexDirection: 'column', gap: 10, position: 'relative' },
    featureCard: {
        display: 'flex', alignItems: 'center', gap: 14,
        background: 'rgba(255,255,255,.055)',
        border: '1px solid rgba(255,255,255,.09)',
        borderRadius: 12, padding: '13px 16px',
        backdropFilter: 'blur(8px)',
        transition: 'background .2s',
        cursor: 'default',
    },
    featureIcon: {
        width: 40, height: 40, borderRadius: 10, flexShrink: 0,
        background: 'rgba(249,115,22,.15)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.15rem',
    },
    featureTitle: { fontWeight: 700, color: 'rgba(255,255,255,.9)', fontSize: '0.875rem' },
    featureDesc: { fontSize: '0.77rem', color: 'rgba(255,255,255,.4)', marginTop: 3 },
    version: { fontSize: '0.7rem', color: 'rgba(255,255,255,.2)', letterSpacing: '.05em', position: 'relative' },

    /* Right panel */
    rightPanel: {
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#fff', padding: '2.5rem',
        overflowY: 'auto', minHeight: '100vh',
        borderLeft: '1px solid rgba(0,0,0,.06)',
    },
    card: { width: '100%', maxWidth: 400 },
    brandRow: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1.75rem' },
    brandIcon: {
        width: 44, height: 44, borderRadius: 11,
        background: 'linear-gradient(135deg,#f97316,#ea580c)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 900, fontSize: '0.9rem', color: 'white',
        boxShadow: '0 5px 16px rgba(249,115,22,.38)',
    },
    brandTitle: { fontWeight: 800, fontSize: '1.3rem', color: '#0f172a', letterSpacing: '-0.4px' },
    brandSub: { fontSize: '0.8rem', color: '#64748b', marginTop: 3 },

    tabs: {
        display: 'flex', background: '#f1f5f9',
        borderRadius: 10, padding: 4, marginBottom: '1.5rem',
    },
    tabActive: {
        flex: 1, padding: '9px', borderRadius: 7,
        fontSize: '0.875rem', fontWeight: 700, textAlign: 'center', cursor: 'pointer',
        background: 'white', color: '#f97316',
        boxShadow: '0 2px 6px rgba(0,0,0,.1)', border: 'none',
        transition: 'all .2s', fontFamily: "'Inter', sans-serif",
    },
    tabInactive: {
        flex: 1, padding: '9px', borderRadius: 7,
        fontSize: '0.875rem', fontWeight: 600, textAlign: 'center', cursor: 'pointer',
        background: 'transparent', color: '#64748b', border: 'none',
        transition: 'all .2s', fontFamily: "'Inter', sans-serif",
    },

    form: { display: 'flex', flexDirection: 'column', gap: '0.9rem' },
    formGroup: { display: 'flex', flexDirection: 'column', gap: 5 },
    label: { fontSize: '0.82rem', fontWeight: 600, color: '#0f172a' },
    input: {
        padding: '11px 15px', border: '1.5px solid #e2e8f0', borderRadius: 9,
        fontSize: '0.9rem', color: '#0f172a', background: '#f8fafc',
        transition: 'border-color .2s, box-shadow .2s',
        fontFamily: "'Inter', sans-serif", outline: 'none', width: '100%',
    },
    submitBtn: {
        padding: '13px', marginTop: 6,
        background: 'linear-gradient(135deg,#f97316,#ea580c)',
        color: 'white', border: 'none', borderRadius: 9,
        fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer',
        letterSpacing: '.02em', fontFamily: "'Inter', sans-serif",
        transition: 'transform .15s, box-shadow .2s',
    },
    errorBox: {
        background: '#fef2f2', border: '1px solid #fecaca',
        borderRadius: 8, padding: '10px 14px',
        color: '#dc2626', fontSize: '0.84rem', marginBottom: '0.5rem',
    },
    switchLink: {
        textAlign: 'center', fontSize: '0.85rem',
        color: '#64748b', marginTop: '1rem',
    },
    demoBox: {
        marginTop: '1.5rem', padding: '12px 14px',
        background: '#fff7ed', borderRadius: 10,
        fontSize: '0.78rem', color: '#9a3412',
        border: '1px solid #fed7aa', lineHeight: 1.75,
    },
};

export default function Login() {
    const [tab, setTab] = useState('login');
    const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', operatorType: 'Domestic' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            if (tab === 'login') {
                await login(form.email, form.password);
            } else {
                if (!form.name) { setError('Name is required'); setLoading(false); return; }
                await register(form);
            }
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const inputFocus = (e) => {
        e.target.style.borderColor = '#f97316';
        e.target.style.boxShadow = '0 0 0 3px rgba(249,115,22,.18)';
        e.target.style.background = '#fff';
    };
    const inputBlur = (e) => {
        e.target.style.borderColor = '#e2e8f0';
        e.target.style.boxShadow = 'none';
        e.target.style.background = '#f8fafc';
    };

    return (
        <div style={S.page}>
            {/* ── LEFT DARK PANEL ── */}
            <div style={S.leftPanel}>
                <div style={S.bgCircle1} />
                <div style={S.bgCircle2} />

                {/* Brand */}
                <div style={S.logoRow}>
                    <div style={S.logoIcon}>ASC</div>
                    <div>
                        <div style={S.logoTitle}>ASC360</div>
                        <div style={S.logoSub}>Operator Dashboard Portal</div>
                    </div>
                </div>

                {/* Headline */}
                <div style={S.headline}>
                    <h1 style={S.h1}>
                        Manage your<br />
                        <span style={S.h1Accent}>insurance business</span><br />
                        smarter.
                    </h1>
                    <p style={S.leadText}>
                        A complete platform for insurance operators to issue, track and manage policies in real-time — domestic & international.
                    </p>
                </div>

                {/* Feature cards */}
                <div style={S.featureList}>
                    {features.map(f => (
                        <div key={f.title} style={S.featureCard}>
                            <div style={S.featureIcon}>{f.icon}</div>
                            <div>
                                <div style={S.featureTitle}>{f.title}</div>
                                <div style={S.featureDesc}>{f.desc}</div>
                            </div>
                        </div>
                    ))}
                </div>

                <div style={S.version}>ASC360 · v1.0 · © 2025 All rights reserved</div>
            </div>

            {/* ── RIGHT WHITE PANEL ── */}
            <div style={S.rightPanel}>
                <div style={S.card}>
                    {/* Brand row */}
                    <div style={S.brandRow}>
                        <div style={S.brandIcon}>ASC</div>
                        <div>
                            <div style={S.brandTitle}>{tab === 'login' ? 'Welcome back' : 'Create account'}</div>
                            <div style={S.brandSub}>{tab === 'login' ? 'Sign in to your operator portal' : 'Register as a new operator'}</div>
                        </div>
                    </div>

                    {/* Tab toggle */}
                    <div style={S.tabs}>
                        {['login', 'register'].map(t => (
                            <button key={t} style={tab === t ? S.tabActive : S.tabInactive} onClick={() => { setTab(t); setError(''); }}>
                                {t === 'login' ? 'Sign In' : 'Register'}
                            </button>
                        ))}
                    </div>

                    {error && <div style={S.errorBox}>{error}</div>}

                    <form style={S.form} onSubmit={handleSubmit}>
                        {tab === 'register' && (
                            <>
                                <div style={S.formGroup}>
                                    <label style={S.label}>Full Name</label>
                                    <input style={S.input} name="name" placeholder="Enter your full name" value={form.name} onChange={handleChange} onFocus={inputFocus} onBlur={inputBlur} required />
                                </div>
                                <div style={S.formGroup}>
                                    <label style={S.label}>Phone Number</label>
                                    <input style={S.input} name="phone" placeholder="Phone number" value={form.phone} onChange={handleChange} onFocus={inputFocus} onBlur={inputBlur} />
                                </div>
                                <div style={S.formGroup}>
                                    <label style={S.label}>Operator Type</label>
                                    <select style={{ ...S.input, cursor: 'pointer' }} name="operatorType" value={form.operatorType} onChange={handleChange}>
                                        <option value="Domestic">Domestic</option>
                                        <option value="International">International</option>
                                        <option value="Both">Both</option>
                                    </select>
                                </div>
                            </>
                        )}
                        <div style={S.formGroup}>
                            <label style={S.label}>Email Address</label>
                            <input style={S.input} name="email" type="email" placeholder="Enter your email" value={form.email} onChange={handleChange} onFocus={inputFocus} onBlur={inputBlur} required />
                        </div>
                        <div style={S.formGroup}>
                            <label style={S.label}>Password</label>
                            <input style={S.input} name="password" type="password" placeholder="Enter your password" value={form.password} onChange={handleChange} onFocus={inputFocus} onBlur={inputBlur} required />
                        </div>
                        <button
                            style={S.submitBtn}
                            type="submit"
                            disabled={loading}
                            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(249,115,22,.4)'; }}
                            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
                        >
                            {loading ? 'Please wait…' : tab === 'login' ? '→  Sign In' : '→  Create Account'}
                        </button>
                    </form>

                    <div style={S.switchLink}>
                        {tab === 'login'
                            ? <span>Don't have an account? <span style={{ color: '#f97316', fontWeight: 700, cursor: 'pointer' }} onClick={() => setTab('register')}>Register</span></span>
                            : <span>Already have an account? <span style={{ color: '#f97316', fontWeight: 700, cursor: 'pointer' }} onClick={() => setTab('login')}>Sign In</span></span>}
                    </div>

                    {/* Demo hint */}
                    <div style={S.demoBox}>
                        <strong>🔑 Demo credentials</strong><br />
                        Email: opt.act360@gmail.com<br />
                        Password: password123
                    </div>
                </div>
            </div>
        </div>
    );
}
