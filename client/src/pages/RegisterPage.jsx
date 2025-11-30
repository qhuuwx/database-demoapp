import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }
    const result = await register({ TenTaiKhoan: username, Email: email, MatKhau: password });
    if (result.success) {
      navigate('/login');
    } else {
      setError(result.message);
    }
  };

  return (
    <div>
      <h2>Đăng ký</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Tên tài khoản" value={username} onChange={e => setUsername(e.target.value)} required /><br/>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required /><br/>
        <input type="password" placeholder="Mật khẩu" value={password} onChange={e => setPassword(e.target.value)} required /><br/>
        <input type="password" placeholder="Xác nhận mật khẩu" value={confirm} onChange={e => setConfirm(e.target.value)} required /><br/>
        <button type="submit">Đăng ký</button>
      </form>
      {error && <p style={{color:'red'}}>{error}</p>}
      <p>Lưu ý: Tất cả tài khoản mới đều là user, không tự chọn Role.</p>
    </div>
  );
}
export default RegisterPage;
