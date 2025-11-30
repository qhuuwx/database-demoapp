
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

    return (
        <nav style={{ background: '#1976d2', padding: '10px 30px', color: '#fff', display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '20px' }}>
                <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontWeight: 'bold' }}>Trang chủ</Link>
                <Link to="/nhacungcap" style={{ color: '#fff', textDecoration: 'none' }}>Nhà cung cấp</Link>
                {role === 'NhanVien' && (
                    <Link to="/admin/users" style={{ color: '#fff', textDecoration: 'none' }}>Quản lý tài khoản</Link>
                )}

            </div>
            <div style={{ marginLeft: 'auto', position: 'relative' }}>
                {user ? (
                    <div style={{ cursor: 'pointer', position: 'relative' }} onClick={() => setDropdownOpen(!dropdownOpen)}>
                        <span style={{ fontWeight: 'bold' }}>{user.TenTaiKhoan}</span>
                        <span style={{ marginLeft: 8, opacity: 0.8 }}>({role}) ▼</span>
                        {dropdownOpen && (
                            <div ref={dropdownRef} style={{ position: 'absolute', right: 0, top: 'calc(100% + 8px)', background: '#fff', color: '#333', minWidth: 180, boxShadow: '0 2px 8px rgba(0,0,0,0.15)', borderRadius: 6, zIndex: 10 }}>
                                <div style={{ padding: '12px 16px', borderBottom: '1px solid #eee' }}>
                                    <div style={{ fontWeight: 'bold' }}>{user.TenTaiKhoan}</div>
                                    <div style={{ fontSize: 13, color: '#666' }}>{user.Email}</div>
                                </div>
                                <button style={{ width: '100%', padding: '10px 0', border: 'none', background: 'none', color: '#1976d2', fontWeight: 'bold', cursor: 'pointer' }} onClick={handleLogout}>Thoát</button>
                            </div>
                        )}
                    </div>
                ) : (
                    <Link to="/login" style={{ color: '#fff', textDecoration: 'none' }}>Đăng nhập</Link>
                )}
            </div>
        </nav>
    );
};

export default Header;
