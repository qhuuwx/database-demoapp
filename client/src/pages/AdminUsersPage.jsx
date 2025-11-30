import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import userService from '../services/userService';

function AdminUsersPage() {
  const { token } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    userService.getAllUsers(token).then(setUsers).catch(() => setError('Không lấy được danh sách'));
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
    <div>
      <h2>Quản lý tài khoản</h2>
      {error && <p>{error}</p>}
      <table border="1">
        <thead>
          <tr>
            <th>Mã</th><th>Tên</th><th>Email</th><th>Vai Trò</th><th>Trạng thái</th><th>Ngày tạo</th><th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.MaTaiKhoan}>
              <td>{u.MaTaiKhoan}</td>
              <td>{u.TenTaiKhoan}</td>
              <td>{u.Email}</td>
              <td>
                <select value={u.VaiTro} onChange={e => handleRoleChange(u.MaTaiKhoan, e.target.value)}>
                  <option value="NhanVien">NhanVien</option>
                  <option value="KhachHang">KhachHang</option>
                </select>
              </td>
              <td>
                <select value={u.TrangThai} onChange={e => handleStatusChange(u.MaTaiKhoan, e.target.value)}>
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="NON-ACTIVE">NON-ACTIVE</option>
                </select>
              </td>
              <td>{u.NgayTao}</td>
              <td></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default AdminUsersPage;
