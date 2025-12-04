import React, { useEffect, useState, useContext } from 'react';
import nhaCungCapService from '../services/NhaCungCapService';
import NhaCungCapTable from '../components/NhaCungCapTable';
import NhaCungCapForm from '../components/NhaCungCapForm';
import { AuthContext } from '../context/AuthContext';

const NhaCungCapPage = () => {
  const { user } = useContext(AuthContext);
  const [list, setList] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [viewMode, setViewMode] = useState('ncc'); // 'ncc' hoặc 'sanpham'
  const [searchKeyword, setSearchKeyword] = useState('');
  const [sortField, setSortField] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const isNhanVien = user?.VaiTro === 'NhanVien';

  const fetchList = async () => {
    const data = await nhaCungCapService.getAll();
    setList(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    fetchList();
  }, []);

  const handleAdd = () => {
    setEditing(null);
    setShowForm(true);
  };

  const handleEdit = (item) => {
    setEditing(item);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa nhà cung cấp này không?')) {
      return;
    }

    try {
      const response = await nhaCungCapService.remove(id);
      if (response && response.success) {
        alert('Xóa nhà cung cấp thành công!');
        fetchList();
      } else {
        // Hiển thị popup lỗi
        setErrorMessage(response.message || 'Nhà cung cấp này đang cung cấp sản phẩm trong hệ thống');
        setShowErrorModal(true);
      }
    } catch (error) {
      // Xử lý lỗi từ backend
      const msg = error.response?.data?.message || error.message || 'Không thể xóa nhà cung cấp';
      setErrorMessage(msg);
      setShowErrorModal(true);
      console.error('Error deleting supplier:', error);
    }
  };

  const handleSubmit = async (data) => {
    if (editing) {
      await nhaCungCapService.update(data);
    } else {
      await nhaCungCapService.create(data);
    }
    setShowForm(false);
    fetchList();
  };
  const handleSeachNCCByArea = async () => {
    if (searchKeyword.trim() === '') {
      fetchList();
      return;
    }
    const data = await nhaCungCapService.thongKeTheoKhuVuc(searchKeyword);
    setList(Array.isArray(data) ? data : []);
  };

  // Sắp xếp dữ liệu
  const handleSort = (field) => {
    const newOrder = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortOrder(newOrder);

    const sortedList = [...list].sort((a, b) => {
      let aVal = a[field];
      let bVal = b[field];

      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (aVal < bVal) return newOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return newOrder === 'asc' ? 1 : -1;
      return 0;
    });

    setList(sortedList);
  };

  return (
    <div className="page-container" style={{ margin: '30px auto' }}>
      <h2 style={{ marginBottom: 32, fontSize: '28px', fontWeight: '600', letterSpacing: '-0.02em', width: '80vw' }}>
        {isNhanVien ? 'Quản lý Nhà cung cấp' : 'Danh sách Nhà cung cấp'}
      </h2>

      {/* Phần điều khiển tìm kiếm */}
      <div className="search-box">
        <h3 style={{ marginBottom: 20, fontSize: '16px', fontWeight: '600' }}>Tìm kiếm Nhà cung cấp theo khu vực</h3>
        <div className="search-controls">
          <input
            type="text"
            className="form-control"
            placeholder="Nhập Tỉnh/Thành Phố..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSeachNCCByArea()}
          />
          <button
            onClick={handleSeachNCCByArea}
            className="btn btn-success"
          >
            Tìm kiếm
          </button>

          {isNhanVien && (
            <button
              onClick={handleAdd}
              className="btn btn-primary"
            >
              Thêm mới
            </button>
          )}
        </div>
      </div>

      <NhaCungCapTable
        list={list}
        onEdit={handleEdit}
        onDelete={handleDelete}
        viewMode={viewMode}
        onSort={handleSort}
        sortField={sortField}
        sortOrder={sortOrder}
      />

      {showForm && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowForm(false)}>
          <div className="modal-content">
            <NhaCungCapForm initial={editing} onSubmit={handleSubmit} onClose={() => setShowForm(false)} />
          </div>
        </div>
      )}

      {/* Error Modal */}
      {showErrorModal && (
        <div className="error-modal-overlay" onClick={() => setShowErrorModal(false)}>
          <div className="error-modal" onClick={(e) => e.stopPropagation()}>
            <div className="error-modal-header">
              <span style={{ fontSize: '24px', lineHeight: '1' }}></span>
              <div style={{ flex: 1 }}>
                <h3>Không thể xóa nhà cung cấp</h3>
                <p style={{ margin: 0, fontSize: '14px', color: '#718096' }}>
                  {errorMessage}
                </p>
              </div>
            </div>

            <div className="error-detail-box">
              <p>
                Nhà cung cấp này đang cung cấp sản phẩm trong hệ thống. Vui lòng xóa các sản phẩm liên quan trước.
              </p>
            </div>

            <div className="error-modal-footer">
              <button onClick={() => setShowErrorModal(false)} className="btn btn-primary">
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NhaCungCapPage;