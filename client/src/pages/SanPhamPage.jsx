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
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000000);
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
    setMinPrice(0);
    setMaxPrice(1000000);
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
            placeholder="Tất cả..."
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
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '12px' }}>
            {/* Price Range Slider */}
            <div>
              <label style={{ display: 'block', marginBottom: '12px', fontSize: '14px', fontWeight: '500', color: '#495057' }}>
                Khoảng giá: {minPrice.toLocaleString('vi-VN')}đ - {maxPrice.toLocaleString('vi-VN')}đ
              </label>
              <div style={{ position: 'relative', padding: '0 8px' }}>
                <div style={{ 
                  position: 'relative', 
                  height: '6px', 
                  background: '#ddd', 
                  borderRadius: '3px',
                  marginTop: '8px'
                }}>
                  <div style={{
                    position: 'absolute',
                    height: '6px',
                    background: 'linear-gradient(to right, #3498db, #3498db)',
                    borderRadius: '3px',
                    left: `${(minPrice/1000000)*100}%`,
                    right: `${100-(maxPrice/1000000)*100}%`
                  }} />
                </div>
                <input
                  type="range"
                  min="0"
                  max="1000000"
                  step="10000"
                  value={minPrice}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (val <= maxPrice - 50000) setMinPrice(val);
                  }}
                  style={{
                    position: 'absolute',
                    width: '100%',
                    height: '6px',
                    top: '0',
                    left: '0',
                    background: 'transparent',
                    pointerEvents: 'all',
                    outline: 'none',
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    cursor: 'pointer',
                    zIndex: minPrice > maxPrice - 100000 ? 5 : 3
                  }}
                />
                <input
                  type="range"
                  min="0"
                  max="1000000"
                  step="10000"
                  value={maxPrice}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (val >= minPrice + 10000) setMaxPrice(val);
                  }}
                  style={{
                    position: 'absolute',
                    width: '100%',
                    height: '6px',
                    top: '0',
                    left: '0',
                    background: 'transparent',
                    pointerEvents: 'all',
                    outline: 'none',
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    cursor: 'pointer',
                    zIndex: 4
                  }}
                />
              </div>
            </div>
            
            {/* Rating Filter */}
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#495057' }}>
                Đánh giá tối thiểu
              </label>
              <select
                className="form-control"
                value={minRating}
                onChange={(e) => setMinRating(e.target.value)}
                style={{ width: '100%', padding: '10px' }}
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
          
          {/* Add CSS for range slider thumb */}
          <style>{`
            input[type="range"]::-webkit-slider-runnable-track {
              background: transparent;
            }
            
            input[type="range"]::-moz-range-track {
              background: transparent;
            }
            
            input[type="range"]::-webkit-slider-thumb {
              -webkit-appearance: none;
              appearance: none;
              width: 20px;
              height: 20px;
              background: white;
              cursor: pointer;
              border-radius: 50%;
              border: 3px solid #667eea;
              box-shadow: 0 2px 8px rgba(0,0,0,0.2);
              margin-top: -7px;
            }
            
            input[type="range"]::-moz-range-thumb {
              width: 20px;
              height: 20px;
              background: white;
              cursor: pointer;
              border-radius: 50%;
              border: 3px solid #667eea;
              box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            }
            
            input[type="range"]::-webkit-slider-thumb:hover {
              border-color: #764ba2;
              transform: scale(1.15);
              box-shadow: 0 3px 12px rgba(102, 126, 234, 0.4);
            }
            
            input[type="range"]::-moz-range-thumb:hover {
              border-color: #764ba2;
              transform: scale(1.15);
              box-shadow: 0 3px 12px rgba(102, 126, 234, 0.4);
            }
            
            input[type="range"]::-webkit-slider-thumb:active {
              border-color: #764ba2;
              transform: scale(1.25);
            }
            
            input[type="range"]::-moz-range-thumb:active {
              border-color: #764ba2;
              transform: scale(1.25);
            }
          `}</style>
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
