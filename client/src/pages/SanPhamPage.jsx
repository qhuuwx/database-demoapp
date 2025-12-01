import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import sanPhamService from '../services/sanPhamService';
import nhaCungCapService from '../services/NhaCungCapService';
import SanPhamTable from '../components/SanPhamTable';
import SanPhamForm from '../components/SanPhamForm';

function SanPhamPage() {
  const { user, token } = useContext(AuthContext);
  const [sanPhamList, setSanPhamList] = useState([]);
  const [nhaCungCapList, setNhaCungCapList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [sortField, setSortField] = useState('MaSanPham');
  const [sortOrder, setSortOrder] = useState('asc');

  const isNhanVien = user?.VaiTro === 'NhanVien';

  useEffect(() => {
    fetchData();
    fetchNhaCungCap();
  }, [token]);

  const fetchData = async () => {
    try {
      const data = await sanPhamService.getAll(token);
      setSanPhamList(data);
      setFilteredList(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchNhaCungCap = async () => {
    try {
      const data = await nhaCungCapService.getAll();
      setNhaCungCapList(data);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    }
  };

  const handleSearchSanPham = async () => {
    try {
      if (searchKeyword.trim() === '') {
        setFilteredList(sanPhamList);
      } else {
        const results = await sanPhamService.searchSanPhamTheoNCC(searchKeyword, token);
        setFilteredList(results);
      }
    } catch (error) {
      console.error('Error searching products:', error);
      alert('Lỗi khi tìm kiếm sản phẩm');
    }
  };

  const handleReset = () => {
    setSearchKeyword('');
    setFilteredList(sanPhamList);
  };

  const handleSort = (field) => {
    const newOrder = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortOrder(newOrder);

    const sorted = [...filteredList].sort((a, b) => {
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
    
    setFilteredList(sorted);
  };

  const handleAdd = () => {
    setEditingItem(null);
    setShowForm(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingItem) {
        await sanPhamService.update({ ...formData, MaSanPham: editingItem.MaSanPham }, token);
        alert('Cập nhật sản phẩm thành công');
      } else {
        await sanPhamService.create(formData, token);
        alert('Thêm sản phẩm thành công');
      }
      setShowForm(false);
      setEditingItem(null);
      fetchData();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Lỗi khi lưu sản phẩm: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) return;
    
    try {
      await sanPhamService.remove(id, token);
      alert('Xóa sản phẩm thành công');
      fetchData();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Lỗi khi xóa sản phẩm: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="page-container">
      <h2 style={{ marginBottom: 24, fontSize: '28px', fontWeight: '700' }}>
        Quản lý Sản phẩm
      </h2>

      {/* Search Section */}
      <div className="search-section" style={{ 
        background: 'white', 
        padding: '24px', 
        borderRadius: '12px', 
        marginBottom: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
      }}>
        <h3 style={{ marginBottom: 16, fontSize: '18px', fontWeight: '600', color: '#2c3e50' }}>
          Tìm kiếm sản phẩm theo nhà cung cấp
        </h3>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Nhập từ khóa tên nhà cung cấp..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearchSanPham()}
            style={{ flex: 1 }}
          />
          <button 
            onClick={handleSearchSanPham}
            className="btn btn-primary"
            style={{ padding: '11px 24px', whiteSpace: 'nowrap' }}
          >
            Tìm kiếm
          </button>
          <button 
            onClick={handleReset}
            className="btn btn-secondary"
            style={{ padding: '11px 24px' }}
          >
            Reset
          </button>
          {isNhanVien && (
            <button 
              onClick={handleAdd}
              className="btn btn-success"
              style={{ padding: '11px 24px', whiteSpace: 'nowrap' }}
            >
              Thêm mới
            </button>
          )}
        </div>
      </div>

      {/* Table Section */}
      <SanPhamTable
        list={filteredList}
        onEdit={handleEdit}
        onDelete={handleDelete}
        sortField={sortField}
        sortOrder={sortOrder}
        onSort={handleSort}
        isNhanVien={isNhanVien}
      />

      {/* Form Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <SanPhamForm
              initial={editingItem}
              onSubmit={handleSubmit}
              onClose={() => setShowForm(false)}
              nhaCungCapList={nhaCungCapList}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default SanPhamPage;
