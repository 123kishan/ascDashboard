import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
    const [tab, setTab] = useState('login'); // 'login' | 'register'
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

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-logo">
                    <div className="auth-logo-icon">ASC</div>
                    <div>
                        <div className="auth-logo-text">ASC360</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Dashboard Portal</div>
                    </div>
                </div>

                {/* Tab toggle */}
                <div style={{ display: 'flex', gap: '0', marginBottom: '1.5rem', background: '#f1f5f9', borderRadius: '10px', padding: '4px' }}>
                    {['login', 'register'].map(t => (
                        <button key={t} onClick={() => setTab(t)} style={{
                            flex: 1, padding: '8px', border: 'none', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 600,
                            cursor: 'pointer', transition: 'all .2s',
                            background: tab === t ? 'white' : 'transparent',
                            color: tab === t ? '#f97316' : '#64748b',
                            boxShadow: tab === t ? '0 1px 4px rgba(0,0,0,.1)' : 'none'
                        }}>{t === 'login' ? 'Sign In' : 'Register'}</button>
                    ))}
                </div>

                <p className="auth-subtitle">{tab === 'login' ? 'Sign in to your operator portal' : 'Create a new operator account'}</p>

                {error && <div className="auth-error">{error}</div>}

                <form className="auth-form" onSubmit={handleSubmit}>
                    {tab === 'register' && (
                        <>
                            <div className="form-group">
                                <label>Full Name</label>
                                <input className="form-input" name="name" placeholder="Enter your name" value={form.name} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label>Phone</label>
                                <input className="form-input" name="phone" placeholder="Phone number" value={form.phone} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Operator Type</label>
                                <select className="form-input" name="operatorType" value={form.operatorType} onChange={handleChange} style={{ cursor: 'pointer' }}>
                                    <option value="Domestic">Domestic</option>
                                    <option value="International">International</option>
                                    <option value="Both">Both</option>
                                </select>
                            </div>
                        </>
                    )}
                    <div className="form-group">
                        <label>Email Address</label>
                        <input className="form-input" name="email" type="email" placeholder="e.g. opt.act360@gmail.com" value={form.email} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input className="form-input" name="password" type="password" placeholder="Enter password" value={form.password} onChange={handleChange} required />
                    </div>
                    <button className="btn-primary" type="submit" disabled={loading}>
                        {loading ? 'Please wait...' : tab === 'login' ? 'Sign In' : 'Create Account'}
                    </button>
                </form>

                <div className="auth-link">
                    {tab === 'login'
                        ? <span onClick={() => setTab('register')}>Don't have an account? Register</span>
                        : <span onClick={() => setTab('login')}>Already have an account? Sign In</span>}
                </div>

                {/* Demo credentials hint */}
                <div style={{ marginTop: '1.25rem', padding: '12px', background: '#fff7ed', borderRadius: '10px', fontSize: '0.8rem', color: '#9a3412' }}>
                    <strong>Demo Login:</strong><br />
                    Email: opt.act360@gmail.com<br />
                    Password: password123
                </div>
            </div>
        </div>
    );
}
