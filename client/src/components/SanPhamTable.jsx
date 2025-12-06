import React from 'react';

const SanPhamTable = ({ list = [], sortField, sortOrder, onSort }) => {
  const safeList = Array.isArray(list) ? list : [];

  const SortableHeader = ({ field, children }) => (
    <th 
      onClick={() => field && onSort(field)}
      style={{ cursor: field ? 'pointer' : 'default', userSelect: 'none' }}
    >
      {children} {field && sortField === field && (sortOrder === 'asc' ? '↑' : '↓')}
    </th>
  );

  return (
    <div className="table-container">
      <h3 style={{ marginBottom: 16, padding: '0 12px', color: '#2c3e50' }}>
        Danh sách sản phẩm ({safeList.length})
      </h3>
      <table>
        <thead>
          <tr>
            <SortableHeader field="MaSanPham">Mã SP</SortableHeader>
            <SortableHeader field="Ten">Tên sản phẩm</SortableHeader>
            <SortableHeader field="TenNhaCungCap">Nhà cung cấp</SortableHeader>
            <SortableHeader field="Gia">Giá</SortableHeader>
            <SortableHeader field="SoLuongTonKho">Tồn</SortableHeader>
            <SortableHeader field="DiemDanhGiaTB">Đánh giá</SortableHeader>
            <SortableHeader field="MoTa">Mô tả</SortableHeader>
            {/* Đã bỏ cột Hành động */}
          </tr>
        </thead>
        <tbody>
          {safeList.length > 0 ? safeList.map(item => (
            <tr key={item.MaSanPham}>
              <td><strong>{item.MaSanPham}</strong></td>
              <td style={{ fontWeight: '600' }}>{item.Ten}</td>
              <td style={{ color: '#555' }}>{item.TenNhaCungCap}</td>
              <td style={{ fontWeight: '600', color: '#28a745' }}>
                {item.Gia?.toLocaleString('vi-VN')} đ
              </td>
              <td style={{ textAlign: 'center' }}>{item.SoLuongTonKho || 0}</td>
              <td style={{ textAlign: 'center' }}>{item.DiemDanhGiaTB || 0}</td>
              <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {item.MoTa}
              </td>
              {/* Đã bỏ các nút button Sửa/Xóa */}
            </tr>
          )) : (
            <tr>
              <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: '#6c757d' }}>
                Không tìm thấy sản phẩm nào
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SanPhamTable;