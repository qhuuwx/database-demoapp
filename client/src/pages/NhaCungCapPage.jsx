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
      await nhaCungCapService.remove(id);
      alert('Xóa nhà cung cấp thành công!');
      fetchList();
    } catch (error) {
      // Xử lý lỗi từ backend
      const errorMessage = error.response?.data?.message || error.message || 'Không thể xóa nhà cung cấp';
      alert(`Lỗi: ${errorMessage}\n\nNhà cung cấp này có thể đang cung cấp sản phẩm trong hệ thống.`);
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

  // Tìm kiếm nhà cung cấp theo khu vực
  const handleSearchSanPham = async () => {
    if (!searchKeyword.trim()) {
      alert('Vui lòng nhập từ khóa Tỉnh/Thành phố');
      return;
    }
    try {
      // Lọc từ danh sách hiện tại theo Tỉnh/Thành phố
      const filtered = list.filter(item => 
        item.TinhThanhPho && item.TinhThanhPho.toLowerCase().includes(searchKeyword.toLowerCase())
      );
      setList(filtered);
      
      if (filtered.length === 0) {
        alert('Không tìm thấy nhà cung cấp nào ở khu vực này');
      }
    } catch (error) {
      console.error('Error searching:', error);
      alert('Lỗi khi tìm kiếm');
    }
  };

  // Reset về danh sách nhà cung cấp ban đầu
  const handleReset = () => {
    setSearchKeyword('');
    setSortField('');
    setSortOrder('asc');
    setViewMode('ncc');
    fetchList();
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
      <h2 style={{ marginBottom: 32, fontSize: '28px', fontWeight: '600', letterSpacing: '-0.02em' }}>
        {isNhanVien ? 'Quản lý Nhà cung cấp' : 'Danh sách Nhà cung cấp'}
      </h2>
      
      {/* Phần điều khiển tìm kiếm */}
      <div className="search-box">
        <h3 style={{ marginBottom: 20, fontSize: '16px', fontWeight: '600' }}>Tìm kiếm Nhà cung cấp theo khu vực</h3>
        <div className="search-controls">
          <input 
            type="text" 
            className="form-control"
            placeholder="Nhập Tỉnh/Thành Phố... (VD: TP.HCM, Hà Nội)"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearchSanPham()}
          />
          <button 
            onClick={handleSearchSanPham}
            className="btn btn-success"
          >
            Tìm kiếm
          </button>
          <button 
            onClick={handleReset}
            className="btn btn-secondary"
          >
            Đặt lại
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
    </div>
  );
};

export default NhaCungCapPage;
