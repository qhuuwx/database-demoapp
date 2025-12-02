import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

function HomePage() {
  const { user } = useContext(AuthContext);
  
  const styles = {
    container: {
      minHeight: 'calc(100vh - 64px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px'
    },
    content: {
      textAlign: 'center',
      maxWidth: '900px'
    },
    title: {
      fontSize: '48px',
      fontWeight: '800',
      color: '#2c3e50',
      marginBottom: '20px'
    },
    subtitle: {
      fontSize: '20px',
      color: '#7f8c8d',
      marginBottom: '40px'
    },
    cardGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '24px',
      marginTop: '40px'
    },
    card: {
      background: 'white',
      borderRadius: '16px',
      padding: '32px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      transition: 'all 0.3s ease',
      textDecoration: 'none',
      color: '#333'
    },
    cardIcon: {
      fontSize: '48px',
      marginBottom: '16px'
    },
    cardTitle: {
      fontSize: '20px',
      fontWeight: '600',
      marginBottom: '12px',
      color: '#2c3e50'
    },
    cardDesc: {
      fontSize: '14px',
      color: '#6c757d',
      lineHeight: '1.6'
    },
    welcomeBox: {
      background: '#ecf8ff',
      padding: '24px 32px',
      borderRadius: '16px',
      color: '#2c3e50',
      marginBottom: '32px',
      boxShadow: '0 2px 8px rgba(52, 152, 219, 0.1)',
      border: '2px solid #3498db'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.title}>Chào mừng đến với RauMaBK</h1>
        <p style={styles.subtitle}>Giải pháp quản lý nhà cung cấp thuốc hiện đại</p>
        
        {user && (
          <div style={styles.welcomeBox}>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>
              Xin chào, {user.TenTaiKhoan}!
            </h3>
            <p style={{ margin: '8px 0 0 0', opacity: 0.9 }}>
              Vai trò: <strong>{user.VaiTro}</strong>
            </p>
          </div>
        )}

        {!user && (
          <div style={{ marginTop: '32px' }}>
            <Link 
              to="/login" 
              style={{
                display: 'inline-block',
                background: 'linear-gradient(135deg, #3498db 100%)',
                color: 'white',
                padding: '90px 150px',
                borderRadius: '12px',
                fontSize: '50px',
                fontWeight: '600',
                textDecoration: 'none',
                boxShadow: '0 4px 20px rgba(102, 126, 234, 0.4)',
                transition: 'all 0.3s ease'
              }}
              
            >
              Đăng nhập
            </Link>
            <p style={{ marginTop: '16px', color: '#7f8c8d', fontSize: '14px' }}>
              Chưa có tài khoản? <Link to="/register" style={{ color: '#667eea', fontWeight: '600', textDecoration: 'none' }}>Đăng ký ngay</Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
export default HomePage;
