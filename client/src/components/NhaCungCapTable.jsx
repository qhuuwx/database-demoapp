import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const NhaCungCapTable = ({ list, onEdit, onDelete }) => {
  const { user } = useContext(AuthContext);
  const safeList = Array.isArray(list) ? list : [];
  const isNhanVien = user?.VaiTro === 'NhanVien';

  return (
    <table border="1" cellPadding="8" style={{ width: '100%', marginTop: 16 }}>
      <thead>
        <tr>
          <th>Mã NCC</th>
          <th>Tên NCC</th>
          <th>Email</th>
          <th>Đường</th>
          <th>Phường xã</th>
          <th>Tỉnh Thành phố</th>
          <th>Số điện thoại</th>
          {isNhanVien && <th>Hành động</th>}
        </tr>
      </thead>
      <tbody>
        {safeList.map(item => (
          <tr key={item.ID}>
            <td>{item.ID}</td>
            <td>{item.Ten}</td>
            <td>{item.Email}</td>
            <td>{item.Duong}</td>
            <td>{item.PhuongXa}</td>
            <td>{item.TinhThanhPho}</td>
            <td>{item.SoDienThoai}</td>
            {isNhanVien && (
              <td>
                <button onClick={() => onEdit(item)}>Sửa</button>
                <button onClick={() => onDelete(item.ID)} style={{ marginLeft: 8 }}>Xóa</button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default NhaCungCapTable;
