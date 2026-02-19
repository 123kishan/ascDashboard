import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const inputStyle = {
    width: '100%', padding: '11px 14px', border: '1.5px solid #e8ecf0',
    borderRadius: 8, fontSize: '0.875rem', fontFamily: 'Inter,sans-serif',
    background: '#f7f9fc', color: '#1e293b', outline: 'none',
    transition: 'border .2s'
};
const labelStyle = { fontSize: '0.85rem', fontWeight: 500, color: '#374151', marginBottom: 6, display: 'block' };

export default function ProfileSettings() {
    const { user } = useAuth();
    const [editing, setEditing] = useState(false);
    const [toast, setToast] = useState(null);
    const [form, setForm] = useState({
        name: user?.name || '', phone: user?.phone || '',
        operatorType: user?.operatorType || 'Domestic',
        liase: user?.liase || '',
        country: user?.country || 'India',
        officeAddress: user?.officeAddress || '',
        website: user?.website || '',
        paymentCurrency: user?.paymentCurrency || 'INR',
        // Bank details
        beneficiaryName: user?.beneficiaryName || '',
        beneficiaryAccount: user?.beneficiaryAccount || '',
        beneficiaryBank: user?.beneficiaryBank || '',
        bankIFSC: user?.bankIFSC || '',
        upiId: user?.upiId || '',
        // Documents
        panCard: user?.panCard || '',
        gstDocument: user?.gstDocument || '',
        aadharCard: user?.aadharCard || '',
        license: user?.license || '',
    });

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

    const handleSave = async () => {
        try {
            await api.put('/auth/profile', form);
            setEditing(false);
            showToast('Profile updated successfully ✅');
        } catch (err) {
            showToast(err.response?.data?.message || 'Failed to update profile', 'error');
        }
    };

    const sectionStyle = {
        background: 'white', borderRadius: 12, padding: '2rem',
        boxShadow: '0 1px 4px rgba(0,0,0,.06)', marginBottom: '1.5rem'
    };
    const gridStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem 2rem' };

    return (
        <div className="content">
            <div className="page-header">
                <div>
                    <div className="page-title">Account Settings</div>
                    <div className="page-subtitle">Manage your operator profile</div>
                </div>
                {!editing && (
                    <button
                        onClick={() => setEditing(true)}
                        style={{ marginLeft: 'auto', padding: '9px 24px', border: '1.5px solid #f97316', background: 'white', color: '#f97316', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}
                    >Edit</button>
                )}
            </div>

            {/* Basic Details */}
            <div style={sectionStyle}>
                <h3 style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '1.5rem', color: '#1e293b' }}>Basic Details</h3>
                <div style={gridStyle}>
                    <div>
                        <label style={labelStyle}>Type</label>
                        {editing ? (
                            <select name="operatorType" value={form.operatorType} onChange={handleChange} style={{ ...inputStyle, cursor: 'pointer' }}>
                                <option>Domestic</option>
                                <option>International</option>
                                <option>Both</option>
                            </select>
                        ) : <div style={inputStyle}>{form.operatorType}</div>}
                    </div>
                    <div>
                        <label style={labelStyle}>Name</label>
                        {editing ? <input name="name" style={inputStyle} value={form.name} onChange={handleChange} /> : <div style={inputStyle}>{form.name}</div>}
                    </div>
                    <div>
                        <label style={labelStyle}>Email</label>
                        <div style={{ ...inputStyle, color: '#94a3b8' }}>{user?.email}</div>
                    </div>
                    <div>
                        <label style={labelStyle}>Phone number</label>
                        {editing ? <input name="phone" style={inputStyle} value={form.phone} onChange={handleChange} /> : <div style={inputStyle}>{form.phone}</div>}
                    </div>
                    <div>
                        <label style={labelStyle}>Upload Logo</label>
                        {editing ? (
                            <input type="file" accept="image/*" style={{ ...inputStyle, padding: '8px 14px' }} />
                        ) : <div style={{ ...inputStyle, color: '#94a3b8' }}>operator logo</div>}
                    </div>
                    <div>
                        <label style={labelStyle}>LIASE</label>
                        {editing ? <input name="liase" style={inputStyle} value={form.liase} onChange={handleChange} placeholder="Liase name" /> : <div style={inputStyle}>{form.liase || 'Not set'}</div>}
                    </div>
                    <div>
                        <label style={labelStyle}>Country</label>
                        {editing ? <input name="country" style={inputStyle} value={form.country} onChange={handleChange} /> : <div style={inputStyle}>{form.country}</div>}
                    </div>
                    <div>
                        <label style={labelStyle}>Office address</label>
                        {editing ? <input name="officeAddress" style={inputStyle} value={form.officeAddress} onChange={handleChange} placeholder="Office address" /> : <div style={inputStyle}>{form.officeAddress || 'Not set'}</div>}
                    </div>
                    <div>
                        <label style={labelStyle}>Website</label>
                        {editing ? <input name="website" style={inputStyle} value={form.website} onChange={handleChange} placeholder="e.g. https://example.com" /> : <div style={inputStyle}>{form.website || 'Not set'}</div>}
                    </div>
                    <div>
                        <label style={labelStyle}>Payment Currency</label>
                        {editing ? (
                            <select name="paymentCurrency" value={form.paymentCurrency} onChange={handleChange} style={{ ...inputStyle, cursor: 'pointer' }}>
                                <option value="INR">INR</option>
                                <option value="USD">USD</option>
                                <option value="EUR">EUR</option>
                            </select>
                        ) : <div style={inputStyle}>{form.paymentCurrency}</div>}
                    </div>
                </div>
            </div>

            {/* Bank Details */}
            <div style={sectionStyle}>
                <h3 style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '1.5rem', color: '#1e293b' }}>Bank Details</h3>
                <div style={gridStyle}>
                    <div>
                        <label style={labelStyle}>Beneficiary name</label>
                        {editing ? <input name="beneficiaryName" style={inputStyle} value={form.beneficiaryName} onChange={handleChange} placeholder="Enter beneficiary name" /> : <div style={{ ...inputStyle, color: '#94a3b8' }}>{form.beneficiaryName || 'Enter beneficiary name'}</div>}
                    </div>
                    <div>
                        <label style={labelStyle}>Beneficiary account</label>
                        {editing ? <input name="beneficiaryAccount" style={inputStyle} value={form.beneficiaryAccount} onChange={handleChange} placeholder="Enter beneficiary account" /> : <div style={{ ...inputStyle, color: '#94a3b8' }}>{form.beneficiaryAccount || 'Enter beneficiary account'}</div>}
                    </div>
                    <div>
                        <label style={labelStyle}>Beneficiary bank</label>
                        {editing ? <input name="beneficiaryBank" style={inputStyle} value={form.beneficiaryBank} onChange={handleChange} placeholder="Enter beneficiary bank" /> : <div style={{ ...inputStyle, color: '#94a3b8' }}>{form.beneficiaryBank || 'Enter beneficiary bank'}</div>}
                    </div>
                    <div>
                        <label style={labelStyle}>Bank IFSC Code</label>
                        {editing ? <input name="bankIFSC" style={inputStyle} value={form.bankIFSC} onChange={handleChange} placeholder="Enter IFSC code" /> : <div style={{ ...inputStyle, color: '#94a3b8' }}>{form.bankIFSC || 'Enter IFSC code'}</div>}
                    </div>
                    <div>
                        <label style={labelStyle}>UPI ID</label>
                        {editing ? <input name="upiId" style={inputStyle} value={form.upiId} onChange={handleChange} placeholder="Enter UPI ID" /> : <div style={{ ...inputStyle, color: '#94a3b8' }}>{form.upiId || 'Enter UPI ID'}</div>}
                    </div>
                </div>
            </div>

            {/* Upload Documents */}
            <div style={sectionStyle}>
                <h3 style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '1.5rem', color: '#1e293b' }}>Upload Documents</h3>
                <div style={gridStyle}>
                    {[
                        { name: 'panCard', label: 'Pan Card', placeholder: 'operator pan card' },
                        { name: 'gstDocument', label: 'GST Document', placeholder: 'operator gst document' },
                        { name: 'aadharCard', label: 'Aadhar Card', placeholder: 'operator aadhar document' },
                        { name: 'license', label: 'License', placeholder: 'operator license' },
                    ].map(doc => (
                        <div key={doc.name}>
                            <label style={labelStyle}>{doc.label}</label>
                            {editing ? (
                                <input type="file" accept="image/*,.pdf" style={{ ...inputStyle, padding: '8px 14px' }} />
                            ) : <div style={{ ...inputStyle, color: '#94a3b8' }}>{form[doc.name] || doc.placeholder}</div>}
                        </div>
                    ))}
                </div>
            </div>

            {/* Action buttons when editing */}
            {editing && (
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '2rem' }}>
                    <button onClick={() => setEditing(false)} style={{ padding: '11px 32px', background: 'white', border: '1.5px solid #e2e8f0', borderRadius: 8, fontWeight: 600, cursor: 'pointer', color: '#64748b' }}>Cancel</button>
                    <button onClick={handleSave} style={{ padding: '11px 32px', background: 'linear-gradient(135deg,#f97316,#ea580c)', color: 'white', borderRadius: 8, fontWeight: 600, cursor: 'pointer', border: 'none' }}>Save Changes</button>
                </div>
            )}

            {toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}
        </div>
    );
}
