
import React, { useContext, useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Header = () => {
    const { user, logout } = useContext(AuthContext);
    const role = user?.VaiTro;
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const styles = {
        nav: {
            background: '#ffffff',
            padding: '16px 40px',
            color: '#2c3e50',
            display: 'flex',
            alignItems: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            borderBottom: '2px solid #3498db',
            position: 'sticky',
            top: 0,
            zIndex: 100
        },
        links: {
            display: 'flex',
            gap: '24px',
            alignItems: 'center'
        },
        link: {
            color: '#2c3e50',
            textDecoration: 'none',
            fontWeight: '500',
            fontSize: '15px',
            padding: '8px 16px',
            borderRadius: '6px',
            transition: 'all 0.3s ease',
            background: 'transparent'
        },
        linkHover: {
            background: '#ecf8ff',
            color: '#3498db'
        },
        userSection: {
            marginLeft: 'auto',
            position: 'relative'
        },
        userButton: {
            cursor: 'pointer',
            position: 'relative',
            padding: '8px 16px',
            borderRadius: '8px',
            transition: 'background 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
        },
        dropdown: {
            position: 'absolute',
            right: 0,
            top: 'calc(100% + 12px)',
            background: '#fff',
            color: '#333',
            minWidth: '220px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            borderRadius: '12px',
            zIndex: 10,
            overflow: 'hidden',
            animation: 'modalSlideIn 0.3s ease'
        },
        dropdownHeader: {
            padding: '16px 20px',
            borderBottom: '1px solid #e9ecef',
            background: '#f8f9fa'
        },
        dropdownName: {
            fontWeight: '600',
            fontSize: '16px',
            marginBottom: '4px'
        },
        dropdownEmail: {
            fontSize: '13px',
            color: '#6c757d'
        },
        logoutButton: {
            width: '100%',
            padding: '14px 20px',
            border: 'none',
            background: 'none',
            color: '#dc3545',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'background 0.2s ease',
            fontSize: '14px'
        }
    };

    return (
        <nav style={styles.nav}>
            <div style={styles.links}>
                <Link to="/" style={styles.link} onMouseEnter={(e) => { e.target.style.background = '#f7fafc'; e.target.style.color = '#3498db'; }} onMouseLeave={(e) => { e.target.style.background = 'transparent'; e.target.style.color = '#2c3e50'; }}>
                    Trang chủ
                </Link>
                <Link to="/nhacungcap" style={styles.link} onMouseEnter={(e) => { e.target.style.background = '#f7fafc'; e.target.style.color = '#3498db'; }} onMouseLeave={(e) => { e.target.style.background = 'transparent'; e.target.style.color = '#2c3e50'; }}>
                    Nhà cung cấp
                </Link>
                <Link to="/sanpham" style={styles.link} onMouseEnter={(e) => { e.target.style.background = '#f7fafc'; e.target.style.color = '#3498db'; }} onMouseLeave={(e) => { e.target.style.background = 'transparent'; e.target.style.color = '#2c3e50'; }}>
                    Sản phẩm
                </Link>
                {role === 'NhanVien' && (
                    <Link to="/admin/users" style={styles.link} onMouseEnter={(e) => { e.target.style.background = '#f7fafc'; e.target.style.color = '#3498db'; }} onMouseLeave={(e) => { e.target.style.background = 'transparent'; e.target.style.color = '#2c3e50'; }}>
                        Quản lý tài khoản
                    </Link>
                )}
            </div>
            <div style={styles.userSection}>
                {user ? (
                    <div style={styles.userButton} onClick={() => setDropdownOpen(!dropdownOpen)} onMouseEnter={(e) => e.currentTarget.style.background = '#f7fafc'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                        <span style={{ fontWeight: '600', color: '#2c3e50' }}>{user.TenTaiKhoan}</span>
                        <span style={{ opacity: 0.6, fontSize: '13px', color: '#718096', marginLeft: '6px' }}>({role})</span>
                        <span style={{ fontSize: '10px', color: '#a0aec0', marginLeft: '4px' }}>▼</span>
                        {dropdownOpen && (
                            <div ref={dropdownRef} style={styles.dropdown}>
                                <div style={styles.dropdownHeader}>
                                    <div style={styles.dropdownName}>{user.TenTaiKhoan}</div>
                                    <div style={styles.dropdownEmail}>{user.Email}</div>
                                </div>
                                <button 
                                    style={styles.logoutButton} 
                                    onClick={handleLogout}
                                    onMouseEnter={(e) => e.target.style.background = '#fed7d7'}
                                    onMouseLeave={(e) => e.target.style.background = 'none'}
                                >
                                    Đăng xuất
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <Link to="/login" style={{...styles.link, background: '#3498db', color: '#fff', fontWeight: '600'}} onMouseEnter={(e) => e.target.style.background = '#2980b9'} onMouseLeave={(e) => e.target.style.background = '#3498db'}>
                        Đăng nhập
                    </Link>
                )}
            </div>
        </nav>
    );
};

export default Header;
