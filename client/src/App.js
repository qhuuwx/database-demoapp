import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminUsersPage from './pages/AdminUsersPage';
import ContentsPage from './pages/ContentsPage';
import RoleGuard from './components/RoleGuard';
import Header from './components/Header';
import NhaCungCapPage from './pages/NhaCungCapPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/nhacungcap" element={<NhaCungCapPage />} />
          <Route path="/admin/users" element={
              <RoleGuard allowedRoles={["NhanVien"]}>
                <AdminUsersPage />
              </RoleGuard>
          } />
          <Route path="/contents" element={
              <RoleGuard allowedRoles={["NhanVien", "KhachHang"]}>
                <ContentsPage />
              </RoleGuard>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
