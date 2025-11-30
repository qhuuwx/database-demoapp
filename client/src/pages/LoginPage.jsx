import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(account, password);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message || 'Lỗi đăng nhập');
    }
  };

  return (
    <div>
      <h2>Đăng nhập</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Email hoặc Tên tài khoản" value={account} onChange={e => setAccount(e.target.value)} required /><br/>
        <input type="password" placeholder="Mật khẩu" value={password} onChange={e => setPassword(e.target.value)} required /><br/>
        <button type="submit">Đăng nhập</button>
      </form>
      {error && <p style={{color:'red'}}>{error}</p>}
    </div>
  );
}
export default LoginPage;
