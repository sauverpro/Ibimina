import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import API from '../utils/api';

const PresidentSetup = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [presidentInfo, setPresidentInfo] = useState(null);
  const [form, setForm] = useState({ password: '', confirm: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) { setError('Invalid setup link.'); setChecking(false); return; }
    API.get(`/auth/president-setup?token=${token}`)
      .then(res => { setPresidentInfo(res.data); setChecking(false); })
      .catch(() => { setError('Invalid or expired setup link.'); setChecking(false); });
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) return setError('Passwords do not match.');
    if (form.password.length < 6) return setError('Password must be at least 6 characters.');
    setLoading(true);
    try {
      await API.post('/auth/president-setup', { token, password: form.password });
      setSuccess('Password set! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Setup failed.');
    } finally {
      setLoading(false);
    }
  };

  if (checking) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--obsidian)' }}>
      <div className="spinner" />
    </div>
  );

  return (
    <div className="login-page">
      <div className="login-bg" />
      <div style={{ position: 'absolute', width: '600px', height: '600px', borderRadius: '50%', border: '1px solid rgba(201,168,76,0.06)', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', width: '400px', height: '400px', borderRadius: '50%', border: '1px solid rgba(201,168,76,0.08)', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none' }} />

      <div className="login-card" style={{ maxWidth: '460px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'var(--gold-dim)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '26px' }}>👑</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '30px', fontWeight: 900, background: 'linear-gradient(135deg, var(--gold) 0%, var(--gold-light) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>IBIMINA</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-dim)', letterSpacing: '3px', textTransform: 'uppercase', marginTop: '4px' }}>President Setup</div>
        </div>

        {presidentInfo && (
          <div style={{ background: 'var(--gold-dim)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '12px 16px', marginBottom: '20px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '1px' }}>Welcome</div>
            <div style={{ fontWeight: 600, color: 'var(--gold)', marginTop: '2px' }}>{presidentInfo.name}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-muted)' }}>{presidentInfo.email}</div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <div className="form-group">
            <label className="form-label">Set Your Password</label>
            <div style={{ position: 'relative' }}>
              <input className="form-input" type={showPass ? 'text' : 'password'} placeholder="••••••••"
                value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required style={{ paddingRight: '44px' }} />
              <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <div style={{ position: 'relative' }}>
              <input className="form-input" type={showConfirm ? 'text' : 'password'} placeholder="••••••••"
                value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })} required style={{ paddingRight: '44px' }} />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}>
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button className="btn btn-primary btn-lg" type="submit" disabled={loading}
            style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }}>
            {loading ? 'Setting password...' : <> Activate My Account <ArrowRight size={16} /> </>}
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>
          Secure · Encrypted · Rwanda
        </div>
      </div>
    </div>
  );
};

export default PresidentSetup;