import { useState } from 'react';
import { MdVisibility, MdVisibilityOff, MdLock } from 'react-icons/md';
import api from '../api/axios';

export default function ChangePassword() {
    const [form, setForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
    const [show, setShow] = useState({ old: false, new: false, confirm: false });
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);
    const [error, setError] = useState('');

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleChange = (e) => {
        setError('');
        setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.oldPassword || !form.newPassword || !form.confirmPassword) {
            setError('All fields are required'); return;
        }
        if (form.newPassword !== form.confirmPassword) {
            setError('New passwords do not match'); return;
        }
        if (form.newPassword.length < 6) {
            setError('Password must be at least 6 characters'); return;
        }
        try {
            setLoading(true);
            await api.put('/auth/change-password', {
                oldPassword: form.oldPassword,
                newPassword: form.newPassword,
            });
            showToast('Password changed successfully! ✅');
            setForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to change password');
        } finally {
            setLoading(false);
        }
    };

    const EyeBtn = ({ field }) => (
        <button type="button"
            onClick={() => setShow(s => ({ ...s, [field]: !s[field] }))}
            style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: '1.1rem', display: 'flex', alignItems: 'center' }}>
            {show[field] ? <MdVisibility /> : <MdVisibilityOff />}
        </button>
    );

    const inputWrapStyle = { position: 'relative', marginTop: 6 };
    const inputStyle = {
        width: '100%', padding: '13px 44px 13px 14px',
        border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: '0.9rem',
        fontFamily: 'Inter,sans-serif', background: '#f7f9fc', outline: 'none',
    };

    return (
        <div className="content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', paddingTop: '2rem' }}>
            <div style={{ background: 'white', borderRadius: 16, padding: '2.5rem', width: '100%', maxWidth: 700, boxShadow: '0 1px 4px rgba(0,0,0,.06)', position: 'relative' }}>
                {/* Orange accent circle */}
                <div style={{ width: 56, height: 56, background: 'linear-gradient(135deg,#f97316,#ea580c)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'absolute', top: '2rem', right: '2rem', boxShadow: '0 4px 16px rgba(249,115,22,.35)' }}>
                    <MdLock style={{ color: 'white', fontSize: '1.4rem' }} />
                </div>

                <h2 style={{ fontWeight: 700, fontSize: '1.4rem', marginBottom: 8 }}>Set New Password</h2>
                <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '2rem' }}>
                    Your new password must be different from the previously used one
                </p>

                {error && (
                    <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 14px', color: '#dc2626', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1.25rem' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1e293b' }}>
                            Old Password <span style={{ color: '#ef4444' }}>*</span>
                        </label>
                        <div style={inputWrapStyle}>
                            <input
                                name="oldPassword"
                                type={show.old ? 'text' : 'password'}
                                style={inputStyle}
                                value={form.oldPassword}
                                onChange={handleChange}
                                placeholder="Enter current password"
                            />
                            <EyeBtn field="old" />
                        </div>
                    </div>

                    <div style={{ marginBottom: '1.25rem' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1e293b' }}>
                            New Password <span style={{ color: '#ef4444' }}>*</span>
                        </label>
                        <div style={inputWrapStyle}>
                            <input
                                name="newPassword"
                                type={show.new ? 'text' : 'password'}
                                style={inputStyle}
                                value={form.newPassword}
                                onChange={handleChange}
                                placeholder="Create new password"
                            />
                            <EyeBtn field="new" />
                        </div>
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1e293b' }}>
                            Confirm New Password <span style={{ color: '#ef4444' }}>*</span>
                        </label>
                        <div style={inputWrapStyle}>
                            <input
                                name="confirmPassword"
                                type={show.confirm ? 'text' : 'password'}
                                style={inputStyle}
                                value={form.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirm your password"
                            />
                            <EyeBtn field="confirm" />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg,#f97316,#ea580c)', color: 'white', border: 'none', borderRadius: 10, fontSize: '1rem', fontWeight: 700, cursor: 'pointer', transition: 'opacity .2s', opacity: loading ? 0.7 : 1 }}
                    >
                        {loading ? 'Updating...' : 'Submit'}
                    </button>
                </form>
            </div>
            {toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}
        </div>
    );
}
