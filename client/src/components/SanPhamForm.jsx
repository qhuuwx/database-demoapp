import React, { useState, useEffect } from 'react';

const defaultData = {
  Ten: '',
  Gia: '',
  MoTa: '',
  SoLuongTonKho: '',
  DiemDanhGiaTB: 0,
  IDNhacungcap: '',
  IDDanhmuc: '',
  IDKhuyenmai: ''
};

const SanPhamForm = ({ initial, onSubmit, onClose, nhaCungCapList }) => {
  const [form, setForm] = useState(initial || defaultData);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initial) {
      setForm(initial);
    }
  }, [initial]);

  const validate = () => {
    const newErrors = {};
    if (!form.Ten || form.Ten.trim() === '') {
      newErrors.Ten = 'Tên sản phẩm không được để trống.';
    }
    if (!form.Gia || isNaN(form.Gia) || parseFloat(form.Gia) <= 0) {
      newErrors.Gia = 'Giá phải là số dương.';
    }
    if (!form.SoLuongTonKho || isNaN(form.SoLuongTonKho) || parseInt(form.SoLuongTonKho) < 0) {
      newErrors.SoLuongTonKho = 'Số lượng tồn kho phải là số không âm.';
    }
    if (!form.IDNhacungcap || form.IDNhacungcap === '') {
      newErrors.IDNhacungcap = 'Vui lòng chọn nhà cung cấp.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(form);
    }
  };

  return (
    <div>
      <div className="modal-header">
        {initial ? 'Sửa Sản phẩm' : 'Thêm mới Sản phẩm'}
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Tên sản phẩm</label>
          <input 
            name="Ten" 
            className="form-control"
            value={form.Ten} 
            onChange={handleChange}
            placeholder="Nhập tên sản phẩm"
          />
          {errors.Ten && <div className="error-message">{errors.Ten}</div>}
        </div>
        
        <div className="form-group">
          <label>Giá</label>
          <input 
            name="Gia" 
            type="number"
            className="form-control"
            value={form.Gia} 
            onChange={handleChange}
            placeholder="Nhập giá sản phẩm"
          />
          {errors.Gia && <div className="error-message">{errors.Gia}</div>}
        </div>
        
        <div className="form-group">
          <label>Số lượng tồn kho</label>
          <input 
            name="SoLuongTonKho" 
            type="number"
            className="form-control"
            value={form.SoLuongTonKho} 
            onChange={handleChange}
            placeholder="Nhập số lượng tồn kho"
          />
          {errors.SoLuongTonKho && <div className="error-message">{errors.SoLuongTonKho}</div>}
        </div>
        
        <div className="form-group">
          <label>Điểm đánh giá TB</label>
          <input 
            name="DiemDanhGiaTB" 
            type="number"
            step="0.1"
            min="0"
            max="5"
            className="form-control"
            value={form.DiemDanhGiaTB} 
            onChange={handleChange}
            placeholder="0-5"
          />
        </div>
        
        <div className="form-group">
          <label>Mô tả</label>
          <textarea 
            name="MoTa" 
            className="form-control"
            value={form.MoTa} 
            onChange={handleChange}
            placeholder="Nhập mô tả sản phẩm"
            rows="3"
          />
        </div>
        
        <div className="form-group">
          <label>Nhà cung cấp</label>
          <select 
            name="IDNhacungcap" 
            className="form-control"
            value={form.IDNhacungcap} 
            onChange={handleChange}
            style={{ padding: '10px', fontSize: '14px' }}
          >
            <option value="">-- Chọn nhà cung cấp --</option>
            {nhaCungCapList && nhaCungCapList.map((ncc) => (
              <option key={ncc.ID} value={ncc.ID}>
                {ncc.Ten}
              </option>
            ))}
          </select>
          {errors.IDNhacungcap && <div className="error-message">{errors.IDNhacungcap}</div>}
        </div>
        
        <div className="form-group">
          <label>Danh mục (tùy chọn)</label>
          <input 
            name="IDDanhmuc" 
            className="form-control"
            value={form.IDDanhmuc} 
            onChange={handleChange}
            placeholder="Nhập ID danh mục"
          />
        </div>
        
        <div className="form-group">
          <label>Khuyến mãi (tùy chọn)</label>
          <input 
            name="IDKhuyenmai" 
            className="form-control"
            value={form.IDKhuyenmai} 
            onChange={handleChange}
            placeholder="Nhập ID khuyến mãi"
          />
        </div>
        
        <div className="modal-footer">
          <button type="button" onClick={onClose} className="btn btn-secondary">
            Đóng
          </button>
          <button type="submit" className="btn btn-primary">
            {initial ? 'Cập nhật' : 'Thêm mới'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SanPhamForm;
