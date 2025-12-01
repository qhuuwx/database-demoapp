import React from 'react';

const SanPhamTable = ({ list = [], onEdit, onDelete, sortField, sortOrder, onSort, isNhanVien }) => {
  const safeList = Array.isArray(list) ? list : [];

  const SortableHeader = ({ field, children }) => (
    <th 
      onClick={() => onSort(field)}
      style={{ cursor: 'pointer', userSelect: 'none' }}
    >
      {children} {sortField === field && (sortOrder === 'asc' ? '↑' : '↓')}
    </th>
  );

  return (
    <div className="table-container">
      <h3 style={{ marginBottom: 16, padding: '0 12px', color: '#2c3e50' }}>
        Danh sách sản phẩm
      </h3>
      <table>
        <thead>
          <tr>
            <SortableHeader field="MaSanPham">Mã SP</SortableHeader>
            <SortableHeader field="Ten">Tên sản phẩm</SortableHeader>
            <SortableHeader field="Gia">Giá</SortableHeader>
            <SortableHeader field="SoLuongTonKho">Tồn kho</SortableHeader>
            <SortableHeader field="DiemDanhGiaTB">Đánh giá</SortableHeader>
            <SortableHeader field="MoTa">Mô tả</SortableHeader>
            {isNhanVien && <th style={{ textAlign: 'center' }}>Hành động</th>}
          </tr>
        </thead>
        <tbody>
          {safeList.length > 0 ? safeList.map(item => (
            <tr key={item.MaSanPham}>
              <td><strong>{item.MaSanPham}</strong></td>
              <td style={{ fontWeight: '600' }}>{item.Ten}</td>
              <td style={{ fontWeight: '600', color: '#28a745' }}>
                {item.Gia?.toLocaleString('vi-VN')} đ
              </td>
              <td style={{ textAlign: 'center' }}>{item.SoLuongTonKho || 0}</td>
              <td style={{ textAlign: 'center' }}>{item.DiemDanhGiaTB || 0}</td>
              <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {item.MoTa}
              </td>
              {isNhanVien && (
                <td style={{ textAlign: 'center' }}>
                  <button 
                    onClick={() => onEdit(item)} 
                    className="btn btn-info"
                    style={{ padding: '6px 12px', fontSize: '13px', marginRight: '6px' }}
                  >
                    Sửa
                  </button>
                  <button 
                    onClick={() => onDelete(item.MaSanPham)} 
                    className="btn btn-danger"
                    style={{ padding: '6px 12px', fontSize: '13px' }}
                  >
                    Xóa
                  </button>
                </td>
              )}
            </tr>
          )) : (
            <tr>
              <td colSpan={isNhanVien ? "7" : "6"} style={{ textAlign: 'center', padding: '40px', color: '#6c757d' }}>
                Chưa có sản phẩm nào
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SanPhamTable;
