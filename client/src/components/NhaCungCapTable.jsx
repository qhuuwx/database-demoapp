import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const NhaCungCapTable = ({ list, onEdit, onDelete, viewMode = 'ncc', onSort, sortField, sortOrder }) => {
  const { user } = useContext(AuthContext);
  const safeList = Array.isArray(list) ? list : [];
  const isNhanVien = user?.VaiTro === 'NhanVien';

  const SortableHeader = ({ field, children }) => (
    <th 
      onClick={() => onSort && onSort(field)}
      style={{ cursor: onSort ? 'pointer' : 'default', userSelect: 'none' }}
    >
      {children}
      {sortField === field && (
        <span style={{ marginLeft: 4 }}>{sortOrder === 'asc' ? '↑' : '↓'}</span>
      )}
    </th>
  );

  // Hiển thị bảng sản phẩm theo nhà cung cấp (proc_TimKiemSanPhamTheoNCC)
  if (viewMode === 'sanpham') {
    return (
      <div className="table-container">
        <h3 style={{ marginBottom: 20, padding: '0', color: '#1a202c', fontSize: '18px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '12px' }}>
          Kết quả tìm kiếm sản phẩm
          <span style={{ 
            fontSize: '13px', 
            padding: '4px 12px', 
            background: '#edf2f7', 
            color: '#4a5568', 
            borderRadius: '6px',
            fontWeight: '500'
          }}>
            {safeList.length}
          </span>
        </h3>
        <table>
          <thead>
            <tr>
              <SortableHeader field="MaSP">Mã SP</SortableHeader>
              <SortableHeader field="TenSanPham">Tên sản phẩm</SortableHeader>
              <SortableHeader field="Gia">Giá</SortableHeader>
              <SortableHeader field="MoTa">Mô tả</SortableHeader>
              <SortableHeader field="TenNhaCungCap">Tên NCC</SortableHeader>
              <SortableHeader field="TinhThanhPho">Tỉnh/TP</SortableHeader>
            </tr>
          </thead>
          <tbody>
            {safeList.length > 0 ? safeList.map((item, index) => (
              <tr key={index}>
                <td><strong>{item.MaSP}</strong></td>
                <td>{item.TenSanPham}</td>
                <td style={{ fontWeight: '600', color: '#28a745' }}>
                  {item.Gia?.toLocaleString('vi-VN')} đ
                </td>
                <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {item.MoTa}
                </td>
                <td>{item.TenNhaCungCap}</td>
                <td>{item.TinhThanhPho}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#6c757d' }}>
                  Không tìm thấy sản phẩm nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }

  // Hiển thị bảng nhà cung cấp mặc định
  return (
    <div className="table-container">
      <h3 style={{ marginBottom: 20, padding: '0', color: '#1a202c', fontSize: '18px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '12px' }}>
        Danh sách nhà cung cấp
      </h3>
      <table>
        <thead>
          <tr>
            <SortableHeader field="ID">Mã NCC</SortableHeader>
            <SortableHeader field="Ten">Tên NCC</SortableHeader>
            <SortableHeader field="Email">Email</SortableHeader>
            <SortableHeader field="Duong">Đường</SortableHeader>
            <SortableHeader field="PhuongXa">Phường xã</SortableHeader>
            <SortableHeader field="TinhThanhPho">Tỉnh/TP</SortableHeader>
            <SortableHeader field="SoDienThoai">Số ĐT</SortableHeader>
          </tr>
        </thead>
        <tbody>
          {safeList.length > 0 ? safeList.map(item => (
            <tr key={item.ID}>
              <td><strong>{item.ID}</strong></td>
              <td style={{ fontWeight: '600' }}>{item.Ten}</td>
              <td>{item.Email}</td>
              <td>{item.Duong}</td>
              <td>{item.PhuongXa}</td>
              <td>{item.TinhThanhPho}</td>
              <td>{item.SoDienThoai}</td>
            </tr>
          )) : (
            <tr>
              <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: '#6c757d' }}>
                Chưa có nhà cung cấp nào
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default NhaCungCapTable;
