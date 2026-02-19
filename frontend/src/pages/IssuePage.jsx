import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function IssuePage() {
    const [plans, setPlans] = useState([]);
    const [form, setForm] = useState({
        coverTitle: '', coverType: 'Domestic', planId: '',
        travelerName: '', travelerAge: '', travelerGender: 'Male',
        startDate: '', endDate: '', premium: ''
    });
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);

    useEffect(() => {
        api.get('/assign-plan/').then(r => setPlans(r.data.data)).catch(console.error);
    }, []);

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(f => {
            const updated = { ...f, [name]: value };
            if (name === 'planId') {
                const plan = plans.find(p => p._id === value);
                if (plan) updated.coverTitle = plan.planTitle;
                if (plan) updated.coverType = plan.scope;
                if (plan) updated.premium = plan.price;
            }
            return updated;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.coverTitle || !form.coverType) return showToast('Fill required fields', 'error');
        try {
            setLoading(true);
            await api.post('/trip-status', form);
            showToast('Policy issued successfully! ✅');
            setForm({ coverTitle: '', coverType: 'Domestic', planId: '', travelerName: '', travelerAge: '', travelerGender: 'Male', startDate: '', endDate: '', premium: '' });
        } catch (err) {
            showToast(err.response?.data?.message || 'Error issuing policy', 'error');
        } finally { setLoading(false); }
    };

    const inputStyle = { padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: '0.875rem', fontFamily: 'Inter,sans-serif', background: '#fafafa', width: '100%' };
    const labelStyle = { fontSize: '0.82rem', fontWeight: 500, color: '#1e293b', marginBottom: 5, display: 'block' };

    return (
        <div className="content">
            <div className="page-header">
                <div>
                    <div className="page-title">Issue Policy</div>
                    <div className="page-subtitle">Create a new travel insurance policy</div>
                </div>
            </div>

            <div className="form-card">
                <form onSubmit={handleSubmit}>
                    <div className="form-grid" style={{ marginBottom: '1rem' }}>
                        <div>
                            <label style={labelStyle}>Select Plan *</label>
                            <select name="planId" value={form.planId} onChange={handleChange} style={{ ...inputStyle, cursor: 'pointer' }}>
                                <option value="">-- Select a plan --</option>
                                {plans.map(p => <option key={p._id} value={p._id}>{p.planTitle} ({p.scope}) - ₹{p.price}</option>)}
                            </select>
                        </div>
                        <div>
                            <label style={labelStyle}>Cover Type *</label>
                            <select name="coverType" value={form.coverType} onChange={handleChange} style={{ ...inputStyle, cursor: 'pointer' }}>
                                <option value="Domestic">Domestic</option>
                                <option value="International">International</option>
                            </select>
                        </div>
                        <div>
                            <label style={labelStyle}>Cover Title *</label>
                            <input name="coverTitle" style={inputStyle} placeholder="e.g. ASC360 Domestic Adventure" value={form.coverTitle} onChange={handleChange} required />
                        </div>
                        <div>
                            <label style={labelStyle}>Traveler Name *</label>
                            <input name="travelerName" style={inputStyle} placeholder="Full name" value={form.travelerName} onChange={handleChange} required />
                        </div>
                        <div>
                            <label style={labelStyle}>Age</label>
                            <input name="travelerAge" type="number" style={inputStyle} placeholder="Age" value={form.travelerAge} onChange={handleChange} />
                        </div>
                        <div>
                            <label style={labelStyle}>Gender</label>
                            <select name="travelerGender" value={form.travelerGender} onChange={handleChange} style={{ ...inputStyle, cursor: 'pointer' }}>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label style={labelStyle}>Start Date</label>
                            <input name="startDate" type="date" style={inputStyle} value={form.startDate} onChange={handleChange} />
                        </div>
                        <div>
                            <label style={labelStyle}>End Date</label>
                            <input name="endDate" type="date" style={inputStyle} value={form.endDate} onChange={handleChange} />
                        </div>
                        <div>
                            <label style={labelStyle}>Premium (₹)</label>
                            <input name="premium" type="number" style={inputStyle} placeholder="Amount" value={form.premium} onChange={handleChange} />
                        </div>
                    </div>
                    <button type="submit" className="btn-primary" style={{ minWidth: 160 }} disabled={loading}>
                        {loading ? 'Issuing...' : 'Issue Policy'}
                    </button>
                </form>
            </div>

            {toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}
        </div>
    );
}
