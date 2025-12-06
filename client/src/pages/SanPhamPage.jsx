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

  // Search & Filter States
  const [searchKeyword, setSearchKeyword] = useState('');
  const [sortField, setSortField] = useState('MaSanPham');
  const [sortOrder, setSortOrder] = useState('asc');
  
  // States cho giá
  const [priceLimit, setPriceLimit] = useState(1000000); // Giá trần (Max của DB)
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000000);
  const [minRating, setMinRating] = useState('');

  const isNhanVien = user?.VaiTro === 'NhanVien';

  // Hàm lấy tên NCC an toàn
  const getNameNCC = (idOrMa, list) => {
    const ncc = list.find(n => n.ID == idOrMa); 
    return ncc ? ncc.Ten : '---';
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const fetchData = async () => {
    try {
      const [productsData, suppliersData] = await Promise.all([
        sanPhamService.getAll(token),
        nhaCungCapService.getAll()
      ]);

      setNhaCungCapList(suppliersData);
      setSanPhamList(productsData);

      // TÍNH TOÁN GIÁ MAX ĐỘNG TỪ DATABASE
      let maxVal = 1000000; 
      if (productsData.length > 0) {
        maxVal = Math.max(...productsData.map(p => p.Gia || 0));
      }
      
      // Nếu giá max tìm được < 1 triệu thì cứ để mặc định 1 triệu cho đẹp
      // Nếu lớn hơn thì lấy giá đó làm trần
      const finalMax = maxVal > 0 ? maxVal : 1000000;

      setPriceLimit(finalMax);
      setMaxPrice(finalMax); // Set mặc định tìm kiếm full range

      // Map tên NCC
      const mapped = productsData.map(item => ({
        ...item,
        TenNhaCungCap: getNameNCC(item.MaNhaCungCap || item.IDNhacungcap || item.NhaCungCapID, suppliersData)
      }));
      
      setFilteredList(mapped);
      
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const reloadProducts = async () => {
    try {
        fetchData();
    } catch (error) {
        console.error(error);
    }
  };

  const handleSearchSanPham = async () => {
    try {
      let results = [];
      // Logic kiểm tra reset: nếu các trường về mặc định
      if (searchKeyword.trim() === '' && minPrice === 0 && maxPrice === priceLimit && minRating === '') {
        const mapped = sanPhamList.map(item => ({
            ...item,
            TenNhaCungCap: getNameNCC(item.MaNhaCungCap || item.IDNhacungcap, nhaCungCapList)
        }));
        setFilteredList(mapped);
        return;
      } 
      
      if (searchKeyword.trim() !== '') {
        results = await sanPhamService.searchSanPhamTheoNCC(searchKeyword, token);
      } else {
        results = sanPhamList;
      }

      const filteredResults = results.filter(item => {
        const priceValid =
          (item.Gia >= (minPrice === '' ? 0 : parseFloat(minPrice))) &&
          (item.Gia <= (maxPrice === '' ? priceLimit : parseFloat(maxPrice)));
        const ratingValid =
          minRating === '' || item.DiemDanhGiaTB >= parseInt(minRating);
        return priceValid && ratingValid;
      });

      const mappedResults = filteredResults.map(item => ({
        ...item,
        TenNhaCungCap: getNameNCC(item.MaNhaCungCap || item.IDNhacungcap, nhaCungCapList)
      }));

      setFilteredList(mappedResults);

    } catch (error) {
      console.error('Error searching products:', error);
      alert('Lỗi khi tìm kiếm sản phẩm');
    }
  };

  const handleReset = () => {
    setSearchKeyword('');
    setMinPrice(0);
    setMaxPrice(priceLimit);
    setMinRating('');
    
    const mapped = sanPhamList.map(item => ({
      ...item,
      TenNhaCungCap: getNameNCC(item.MaNhaCungCap || item.IDNhacungcap, nhaCungCapList)
    }));
    setFilteredList(mapped);
  };

  const handleSort = (field) => {
    const newOrder = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortOrder(newOrder);

    const sorted = [...filteredList].sort((a, b) => {
      let aVal = a[field];
      let bVal = b[field];
      if (aVal === null || aVal === undefined) aVal = '';
      if (bVal === null || bVal === undefined) bVal = '';

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
        alert('Cập nhật thành công');
      } else {
        await sanPhamService.create(formData, token);
        alert('Thêm mới thành công');
      }
      setShowForm(false);
      reloadProducts();
    } catch (error) {
      console.error('Error saving:', error);
      alert('Lỗi lưu sản phẩm');
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Bạn có chắc muốn xóa?")) return;
    try {
        await sanPhamService.remove(id, token);
        alert("Xóa thành công");
        reloadProducts();
    } catch (error) {
        alert("Lỗi xóa sản phẩm");
    }
  }

  return (
    <div className="page-container">
      <h2 style={{ marginBottom: 24, fontSize: '28px', fontWeight: '700', width: '80vw' }}>
        Quản lý Sản phẩm
      </h2>

      {/* Search & Filter Section */}
      <div className="search-section" style={{
        background: 'white',
        padding: '24px',
        borderRadius: '12px',
        marginBottom: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
      }}>
        {/* Hàng 1: Tìm kiếm Text */}
        <h3 style={{ marginBottom: 16, fontSize: '18px', fontWeight: '600', color: '#2c3e50' }}>
          Tìm kiếm & Lọc
        </h3>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '24px' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Nhập tên nhà cung cấp..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearchSanPham()}
            style={{ flex: 1 }}
          />
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

        {/* Hàng 2: Bộ lọc nâng cao (Giá & Rating) */}
        <div style={{
          borderTop: '1px solid #e9ecef',
          paddingTop: '20px',
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px', marginBottom: '20px' }}>
            
            {/* --- CỘT 1: RANGE SLIDER VỚI INPUT --- */}
            <div>
              <label style={{ display: 'block', marginBottom: '12px', fontSize: '14px', fontWeight: '600', color: '#495057' }}>
                Khoảng giá (VNĐ)
              </label>
              
              {/* Hai ô Input điền giá */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <input 
                  type="number" 
                  className="form-control"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value === '' ? '' : parseInt(e.target.value))}
                  placeholder="0"
                  style={{ height: '38px' }}
                />
                <span style={{ fontWeight: 'bold', color: '#999' }}>-</span>
                <input 
                  type="number" 
                  className="form-control"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value === '' ? '' : parseInt(e.target.value))}
                  placeholder={priceLimit}
                  style={{ height: '38px' }}
                />
              </div>

              {/* Thanh trượt Slider */}
              <div style={{ position: 'relative', padding: '0 8px', height: '24px' }}>
                <div style={{
                  position: 'relative',
                  height: '6px',
                  background: '#ddd',
                  borderRadius: '3px',
                  top: '9px'
                }}>
                  <div style={{
                    position: 'absolute',
                    height: '6px',
                    background: 'linear-gradient(to right, #3498db, #2980b9)',
                    borderRadius: '3px',
                    left: `${Math.min(100, Math.max(0, (minPrice / priceLimit) * 100))}%`,
                    right: `${100 - Math.min(100, Math.max(0, (maxPrice / priceLimit) * 100))}%`
                  }} />
                </div>
                
                {/* Input Min Thumb */}
                <input
                  type="range"
                  min="0"
                  max={priceLimit}
                  step={priceLimit / 100}
                  value={minPrice || 0}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (val <= (maxPrice || priceLimit)) setMinPrice(val);
                  }}
                  style={{
                    position: 'absolute',
                    width: '100%',
                    height: '6px',
                    top: '9px',
                    left: '0',
                    background: 'transparent',
                    pointerEvents: 'all',
                    outline: 'none',
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    cursor: 'pointer',
                    zIndex: (minPrice > (maxPrice || priceLimit) - (priceLimit * 0.1)) ? 5 : 3
                  }}
                />
                
                {/* Input Max Thumb */}
                <input
                  type="range"
                  min="0"
                  max={priceLimit}
                  step={priceLimit / 100}
                  value={maxPrice || priceLimit}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (val >= (minPrice || 0)) setMaxPrice(val);
                  }}
                  style={{
                    position: 'absolute',
                    width: '100%',
                    height: '6px',
                    top: '9px',
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

            {/* --- CỘT 2: RATING FILTER --- */}
            <div>
              <label style={{ display: 'block', marginBottom: '12px', fontSize: '14px', fontWeight: '600', color: '#495057' }}>
                Đánh giá tối thiểu
              </label>
              <select
                className="form-control"
                value={minRating}
                onChange={(e) => setMinRating(e.target.value)}
                style={{ width: '100%', height: '38px' }}
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

          {/* Nút hành động */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={handleSearchSanPham}
              className="btn btn-primary"
              style={{ padding: '11px 24px', fontWeight: '600' }}
            >
              Áp dụng bộ lọc
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

      {/* --- PHẦN STYLE CHO SLIDER --- */}
      <style>{`
        input[type="range"]::-webkit-slider-runnable-track { background: transparent; }
        input[type="range"]::-moz-range-track { background: transparent; }
        
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          background: white;
          cursor: pointer;
          border-radius: 50%;
          border: 2px solid #3498db;
          box-shadow: 0 2px 5px rgba(0,0,0,0.2);
          margin-top: -7px;
          position: relative;
          z-index: 10;
        }
        input[type="range"]::-moz-range-thumb {
          width: 20px;
          height: 20px;
          background: white;
          cursor: pointer;
          border-radius: 50%;
          border: 2px solid #3498db;
          box-shadow: 0 2px 5px rgba(0,0,0,0.2);
          position: relative;
          z-index: 10;
        }
        input[type="range"]::-webkit-slider-thumb:hover { transform: scale(1.1); border-color: #2980b9; }
      `}</style>
      
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