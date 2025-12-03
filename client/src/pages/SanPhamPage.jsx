import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import sanPhamService from '../services/sanPhamService';
import nhaCungCapService from '../services/NhaCungCapService';
import SanPhamTable from '../components/SanPhamTable';
import SanPhamForm from '../components/SanPhamForm';

function SanPhamPage() {
  const getNameNCC = (ID) => {
    const ncc = nhaCungCapList.find(ncc => ncc.ID === ID);
    return ncc ? ncc.Ten : '';
  };
  const { user, token } = useContext(AuthContext);
  const [sanPhamList, setSanPhamList] = useState([]);
  const [nhaCungCapList, setNhaCungCapList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [sortField, setSortField] = useState('MaSanPham');
  const [sortOrder, setSortOrder] = useState('asc');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minRating, setMinRating] = useState('');

  useEffect(() => {
    fetchData();
    fetchNhaCungCap();
  }, [token]);

  const fetchData = async () => {
    try {
      const data = await sanPhamService.getAll(token);
      setSanPhamList(data);
      // Map TenNhaCungCap khi fetch lần đầu
      const mapped = data.map(item => ({
        ...item,
        TenNhaCungCap: item.TenNhaCungCap || getNameNCC(item.IDNhacungcap)
      }));
      setFilteredList(mapped);
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
      let results = [];
      if (searchKeyword.trim() === '' && minPrice === '' && maxPrice === '' && minRating === '') {
        results = sanPhamList;
      } else {
        if (searchKeyword.trim() !== '') {
          results = await sanPhamService.searchSanPhamTheoNCC(searchKeyword, token);
        } else {
          results = sanPhamList;
        }
        results = results.filter(item => {
          const priceValid =
            (minPrice === '' || item.Gia >= parseFloat(minPrice)) &&
            (maxPrice === '' || item.Gia <= parseFloat(maxPrice));
          const ratingValid =
            minRating === '' || item.DiemDanhGiaTB >= parseInt(minRating);
          return priceValid && ratingValid;
        });
      }
      // Map thêm TenNhaCungCap cho từng sản phẩm
      const mapped = results.map(item => ({
        ...item,
        TenNhaCungCap: item.TenNhaCungCap || getNameNCC(item.IDNhacungcap)
      }));
      setFilteredList(mapped);
    } catch (error) {
      console.error('Error searching products:', error);
      alert('Lỗi khi tìm kiếm sản phẩm');
    }
  };

  const handleReset = () => {
    setSearchKeyword('');
    setMinPrice('');
    setMaxPrice('');
    setMinRating('');
    // Map lại TenNhaCungCap khi reset
    const mapped = sanPhamList.map(item => ({
      ...item,
      TenNhaCungCap: item.TenNhaCungCap || getNameNCC(item.IDNhacungcap)
    }));
    setFilteredList(mapped);
  };

  const handleSort = (field) => {
    console.log("Sorting by field:", field);
    const newOrder = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortOrder(newOrder);

    const sorted = [...filteredList].sort((a, b) => {
      let aVal = a[field];
      let bVal = b[field];
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return newOrder === 'asc'
          ? aVal.localeCompare(bVal, 'vi', { sensitivity: 'base' })
          : bVal.localeCompare(aVal, 'vi', { sensitivity: 'base' });
      }
      if (aVal < bVal) return newOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return newOrder === 'asc' ? 1 : -1;
      return 0;
    });
    setFilteredList(sorted);
  };

  return (
    <div className="page-container">
      <h2 style={{ marginBottom: 24, fontSize: '28px', fontWeight: '700', width: '80vw' }}>
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
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Nhập từ khóa tên nhà cung cấp..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearchSanPham()}
            style={{ flex: 1 }}
          />
        </div>

        {/* Filter Section */}
        <div style={{
          borderTop: '1px solid #e9ecef',
          paddingTop: '16px',
          marginTop: '16px'
        }}>
          <h3 style={{ marginBottom: 16, fontSize: '18px', fontWeight: '600', color: '#2c3e50' }}>
            Lọc sản phẩm
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '12px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#495057' }}>
                Giá tối thiểu (đ)
              </label>
              <input
                type="number"
                className="form-control"
                placeholder="Ví dụ: 100000"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                style={{ width: '100%' }}
                onKeyPress={(e) => e.key === 'Enter' && handleSearchSanPham()}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#495057' }}>
                Giá tối đa (đ)
              </label>
              <input
                type="number"
                className="form-control"
                placeholder="Ví dụ: 500000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                style={{ width: '100%' }}
                onKeyPress={(e) => e.key === 'Enter' && handleSearchSanPham()}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#495057' }}>
                Đánh giá tối thiểu
              </label>
              <select
                className="form-control"
                value={minRating}
                onChange={(e) => setMinRating(e.target.value)}
                style={{ width: '100%' }}
                onKeyPress={(e) => e.key === 'Enter' && handleSearchSanPham()}
              >
                <option value="">Tất cả</option>
                <option value="1">⭐ 1 sao trở lên</option>
                <option value="2">⭐ 2 sao trở lên</option>
                <option value="3">⭐ 3 sao trở lên</option>
                <option value="4">⭐ 4 sao trở lên</option>
                <option value="5">⭐ 5 sao</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
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
              Đặt lại
            </button>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <SanPhamTable
        list={filteredList}
        ListNCC={nhaCungCapList}
        sortField={sortField}
        sortOrder={sortOrder}
        onSort={handleSort}
      />

      {/* Form Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <SanPhamForm
              initial={editingItem}
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
