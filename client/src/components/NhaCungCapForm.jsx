import React, { useState } from 'react';

const defaultData = {
  Ten: '',
  Email: '',
  Duong: '',
  PhuongXa: '',
  TinhThanhPho: '',
  SoDienThoai: ''
};

const TINH_THANH_PHO = [
  'An Giang',
  'Bắc Ninh',
  'Bình Phước',
  'Bình Thuận',
  'Cà Mau',
  'Cao Bằng',
  'Điện Biên',
  'Đắk Lắk',
  'Đồng Nai',
  'Đồng Tháp',
  'Gia Lai',
  'Hà Nội',
  'Hà Tĩnh',
  'Hưng Yên',
  'Khánh Hòa',
  'Lâm Đồng',
  'Lạng Sơn',
  'Lào Cai',
  'Nghệ An',
  'Ninh Bình',
  'Phú Thọ',
  'Quảng Ngãi',
  'Quảng Ninh',
  'Quảng Trị',
  'Sơn La',
  'Tây Ninh',
  'Thái Nguyên',
  'Thanh Hóa',
  'TP Đà Nẵng',
  'TP Hải Phòng',
  'TP Hồ Chí Minh',
  'TP Huế',
  'Tuyên Quang',
  'Vĩnh Long'
];

const NhaCungCapForm = ({ initial, onSubmit, onClose }) => {
  const [form, setForm] = useState(initial || defaultData);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!form.Ten || form.Ten.trim() === '') {
      newErrors.Ten = 'Tên nhà cung cấp không được để trống.';
    }
    if (!form.Email || !/^\S+@\S+\.\S+$/.test(form.Email)) {
      newErrors.Email = 'Email không hợp lệ.';
    }
    if (
      !form.SoDienThoai ||
      form.SoDienThoai.length < 10 ||
      form.SoDienThoai.length > 11 ||
      /[^0-9]/.test(form.SoDienThoai) ||
      form.SoDienThoai[0] !== '0'
    ) {
      newErrors.SoDienThoai = 'Số điện thoại phải là số, bắt đầu từ 0 và có 10-11 ký tự.';
    }
    if (!form.Duong || form.Duong.trim() === '') {
      newErrors.Duong = 'Đường không được để trống.';
    }
    if (!form.PhuongXa || form.PhuongXa.trim() === '') {
      newErrors.PhuongXa = 'Phường/Xã không được để trống.';
    }
    if (!form.TinhThanhPho || form.TinhThanhPho.trim() === '') {
      newErrors.TinhThanhPho = 'Tỉnh/Thành phố không được để trống.';
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
        {initial ? 'Sửa Nhà cung cấp' : 'Thêm mới Nhà cung cấp'}
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Tên nhà cung cấp</label>
          <input 
            name="Ten" 
            className="form-control"
            value={form.Ten} 
            onChange={handleChange}
            placeholder="Nhập tên nhà cung cấp"
          />
          {errors.Ten && <div className="error-message">{errors.Ten}</div>}
        </div>
        
        <div className="form-group">
          <label>Email</label>
          <input 
            name="Email" 
            type="email"
            className="form-control"
            value={form.Email} 
            onChange={handleChange}
            placeholder="example@email.com"
          />
          {errors.Email && <div className="error-message">{errors.Email}</div>}
        </div>
        
        <div className="form-group">
          <label>Đường</label>
          <input 
            name="Duong" 
            className="form-control"
            value={form.Duong} 
            onChange={handleChange}
            placeholder="Nhập tên đường"
          />
          {errors.Duong && <div className="error-message">{errors.Duong}</div>}
        </div>
        
        <div className="form-group">
          <label>Phường xã</label>
          <input 
            name="PhuongXa" 
            className="form-control"
            value={form.PhuongXa} 
            onChange={handleChange}
            placeholder="Nhập phường/xã"
          />
          {errors.PhuongXa && <div className="error-message">{errors.PhuongXa}</div>}
        </div>
        
        <div className="form-group">
          <label>Tỉnh Thành phố</label>
          <select 
            name="TinhThanhPho" 
            className="form-control"
            value={form.TinhThanhPho} 
            onChange={handleChange}
            style={{ padding: '10px', fontSize: '14px' }}
          >
            <option value="">-- Chọn tỉnh/thành phố --</option>
            {TINH_THANH_PHO.map((tinh, index) => (
              <option key={index} value={tinh}>{tinh}</option>
            ))}
          </select>
          {errors.TinhThanhPho && <div className="error-message">{errors.TinhThanhPho}</div>}
        </div>
        
        <div className="form-group">
          <label>Số điện thoại</label>
          <input 
            name="SoDienThoai" 
            className="form-control"
            value={form.SoDienThoai} 
            onChange={handleChange}
            placeholder="Nhập số điện thoại (10-11 số)"
          />
          {errors.SoDienThoai && <div className="error-message">{errors.SoDienThoai}</div>}
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

export default NhaCungCapForm;
