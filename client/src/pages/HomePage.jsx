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
          <Link to="/login" style={styles.card} onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px)';
            e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.15)';
          }} onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
          }}>
            <div style={{ ...styles.cardIcon, fontSize: '0' }}></div>
            <div style={styles.cardTitle}>Đăng nhập</div>
            <div style={styles.cardDesc}>
              Đăng nhập để truy cập đầy đủ các tính năng của hệ thống
            </div>
          </Link>
        )}
      </div>
    </div>
  );
}
export default HomePage;
