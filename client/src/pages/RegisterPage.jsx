import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }
    setLoading(true);
    setError('');
    const result = await register({ TenTaiKhoan: username, Email: email, MatKhau: password });
    setLoading(false);
    if (result.success) {
      alert('Đăng ký thành công! Vui lòng đăng nhập.');
      navigate('/login');
    } else {
      setError(result.message);
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
      maxWidth: '500px'
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
          <h2 style={styles.title}>Đăng ký</h2>
          <p style={styles.subtitle}>Tạo tài khoản mới</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Tên tài khoản</label>
            <input
              type="text"
              className="form-control"
              placeholder="Nhập tên tài khoản"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="example@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
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

          <div className="form-group">
            <label>Xác nhận mật khẩu</label>
            <input
              type="password"
              className="form-control"
              placeholder="Nhập lại mật khẩu"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              required
            />
          </div>

          <div className="alert alert-info" style={{ fontSize: '13px' }}>
            Tất cả tài khoản mới đều có vai trò KhachHang
          </div>

          {error && (
            <div className="alert alert-danger">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn-login"
            style={{ width: '100%', padding: '14px', fontSize: '16px', fontWeight: '600' }}
            disabled={loading}
          >
            {loading ? 'Đang đăng ký...' : 'Đăng ký'}
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center', color: '#6c757d', fontSize: '14px' }}>
          Đã có tài khoản? <Link to="/login" style={{ color: '#3498db', fontWeight: '600', textDecoration: 'none' }}>Đăng nhập</Link>
        </div>
      </div>
    </div>
  );
}
export default RegisterPage;
