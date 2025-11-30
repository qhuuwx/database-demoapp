import React, { useState } from 'react';

const defaultData = {
  Ten: '',
  Email: '',
  Duong: '',
  PhuongXa: '',
  TinhThanhPho: '',
  SoDienThoai: ''
};

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
    if (!form.SoDienThoai || form.SoDienThoai.length < 10 || form.SoDienThoai.length > 11 || /[^0-9]/.test(form.SoDienThoai)) {
      newErrors.SoDienThoai = 'Số điện thoại phải là số và có 10-11 ký tự.';
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
    <div style={{ background: '#fff', border: '1px solid #ccc', padding: 24, marginTop: 24 }}>
      <h3>{initial ? 'Sửa' : 'Thêm mới'} Nhà cung cấp</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Tên nhà cung cấp:</label>
          <input name="Ten" value={form.Ten} onChange={handleChange} />
          {errors.Ten && <div style={{ color: 'red' }}>{errors.Ten}</div>}
        </div>
        <div>
          <label>Email:</label>
          <input name="Email" value={form.Email} onChange={handleChange} />
          {errors.Email && <div style={{ color: 'red' }}>{errors.Email}</div>}
        </div>
        <div>
          <label>Đường:</label>
          <input name="Duong" value={form.Duong} onChange={handleChange} />
          {errors.Duong && <div style={{ color: 'red' }}>{errors.Duong}</div>}
        </div>
        <div>
          <label>Phường xã:</label>
          <input name="PhuongXa" value={form.PhuongXa} onChange={handleChange} />
          {errors.PhuongXa && <div style={{ color: 'red' }}>{errors.PhuongXa}</div>}
        </div>
        <div>
          <label>Tỉnh Thành phố:</label>
          <input name="TinhThanhPho" value={form.TinhThanhPho} onChange={handleChange} />
          {errors.TinhThanhPho && <div style={{ color: 'red' }}>{errors.TinhThanhPho}</div>}
        </div>
        <div>
          <label>Số điện thoại:</label>
          <input name="SoDienThoai" value={form.SoDienThoai} onChange={handleChange} />
          {errors.SoDienThoai && <div style={{ color: 'red' }}>{errors.SoDienThoai}</div>}
        </div>
        <div style={{ marginTop: 16 }}>
          <button type="submit">{initial ? 'Cập nhật' : 'Thêm mới'}</button>
          <button type="button" onClick={onClose} style={{ marginLeft: 8 }}>Đóng</button>
        </div>
      </form>
    </div>
  );
};

export default NhaCungCapForm;
