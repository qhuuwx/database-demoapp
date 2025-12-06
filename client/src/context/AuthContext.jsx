import React, { createContext, useState, useEffect } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      authService.getCurrentUser(storedToken)
        .then((userData) => { setUser(userData); })
        .catch(() => {
          setUser(null);
        });
    }
  }, []);
  const login = async (account, password) => {
    try {
      let res;
      if (account.includes('@')) {
        res = await authService.login({ Email: account, MatKhau: password });
      } else {
        res = await authService.login({ TenTaiKhoan: account, MatKhau: password });
      }
      if (res.token) {
        setToken(res.token);
        setUser(res.user);
        localStorage.setItem('token', res.token);
        return { success: true };
      } else {
        return { success: false, message: "Không thể tạo mã xác thực" };
      }
    } catch (err) {
      return { success: false, message: err.response?.data?.message };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  const register = async (data) => {
    try {
      const res = await authService.register({ ...data, VaiTro: 'KhachHang' });
      if (res.user) return { success: true };
      return { success: false, message: res.message };
    } catch (err) {
      return { success: false, message: err.response?.data?.message };
    }
  };
  return (
    <AuthContext.Provider value={{ user, token, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}
