import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import userService from '../services/userService';

function AdminUsersPage() {
  const { token } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    userService.getAllUsers(token)
      .then(setUsers)
      .catch(() => setError('Không lấy được danh sách'))
      .finally(() => setLoading(false));
  }, [token]);

  const handleRoleChange = async (id, role) => {
    await userService.updateUserRole(id, role, token);
    userService.getAllUsers(token).then(setUsers);
  };
  
  const handleStatusChange = async (id, status) => {
    await userService.updateUserStatus(id, status, token);
    userService.getAllUsers(token).then(setUsers);
  };

  return (
    <div className="page-container" style={{ margin: '24px auto' }}>
      <h2 style={{ marginBottom: 24, fontSize: '28px', fontWeight: '700' }}>
        Quản lý tài khoản
      </h2>
      
      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}
      
      {loading ? (
        <div className="spinner"></div>
      ) : (
        <div className="table-container">
          <h3 style={{ marginBottom: 16, padding: '0 12px', color: '#2c3e50' }}>
            Danh sách người dùng 
          </h3>
          <table>
            <thead>
              <tr>
                <th>Mã TK</th>
                <th>Tên tài khoản</th>
                <th>Email</th>
                <th>Vai trò</th>
                <th>Trạng thái</th>
                <th>Ngày tạo</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? users.map(u => (
                <tr key={u.MaTaiKhoan}>
                  <td><strong>#{u.MaTaiKhoan}</strong></td>
                  <td style={{ fontWeight: '600' }}>{u.TenTaiKhoan}</td>
                  <td>{u.Email}</td>
                  <td>
                    <select 
                      value={u.VaiTro} 
                      onChange={e => handleRoleChange(u.MaTaiKhoan, e.target.value)}
                      className="form-control"
                      style={{ padding: '6px 12px', fontSize: '13px' }}
                    >
                      <option value="NhanVien">NhanVien</option>
                      <option value="KhachHang">KhachHang</option>
                    </select>
                  </td>
                  <td>
                    <select 
                      value={u.TrangThai} 
                      onChange={e => handleStatusChange(u.MaTaiKhoan, e.target.value)}
                      className="form-control"
                      style={{ padding: '6px 12px', fontSize: '13px' }}
                    >
                      <option value="ACTIVE">ACTIVE</option>
                      <option value="NON-ACTIVE">NON-ACTIVE</option>
                    </select>
                  </td>
                  <td>{new Date(u.NgayTao).toLocaleDateString('vi-VN')}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#6c757d' }}>
                    Chưa có người dùng nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
export default AdminUsersPage;
