import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

function LoginPage() {
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await login(account, password);
    setLoading(false);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message || 'Lỗi đăng nhập');
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    },
    card: {
      background: 'white',
      borderRadius: '20px',
      boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
      padding: '48px',
      width: '100%',
      maxWidth: '450px'
    },
    header: {
      textAlign: 'center',
      marginBottom: '32px'
    },
    title: {
      fontSize: '32px',
      fontWeight: '700',
      color: '#2c3e50',
      marginBottom: '8px',
      textAlign: 'center'
    },
    subtitle: {
      color: '#6c757d',
      fontSize: '15px'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.title}>Đăng nhập</h2>
          <p style={styles.subtitle}>Chào mừng bạn trở lại!</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email hoặc Tên tài khoản</label>
            <input
              type="text"
              className="form-control"
              placeholder="Nhập email hoặc tên tài khoản"
              value={account}
              onChange={e => setAccount(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Mật khẩu</label>
            <input
              type="password"
              className="form-control"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div className="alert alert-danger">
              {error}
            </div>
          )}
          <button
            type="submit"
            className="btn-login"
            style={{ width: '100%', padding: '14px', fontSize: '16px', fontWeight: '600', textAlign: 'center' }}
            disabled={loading}

          >
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center', color: '#6c757d', fontSize: '14px' }}>
          Chưa có tài khoản? <Link to="/register" style={{ color: '#3498db', fontWeight: '600', textDecoration: 'none' }}>Đăng ký ngay</Link>
        </div>
      </div>
    </div>
  );
}
export default LoginPage;
