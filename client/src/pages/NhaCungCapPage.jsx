import React, { useEffect, useState, useContext } from 'react';
import nhaCungCapService from '../services/NhaCungCapService';
import NhaCungCapTable from '../components/NhaCungCapTable';
import NhaCungCapForm from '../components/NhaCungCapForm';
import { AuthContext } from '../context/AuthContext';

const NhaCungCapPage = () => {
  const { user } = useContext(AuthContext);
  const [list, setList] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const isNhanVien = user?.VaiTro === 'NhanVien';
  const fetchList = async () => {
    const data = await nhaCungCapService.getAll();
    setList(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    fetchList();
  }, []);

  const handleAdd = () => {
    setEditing(null);
    setShowForm(true);
  };

  const handleEdit = (item) => {
    setEditing(item);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    await nhaCungCapService.remove(id);
    fetchList();
  };

  const handleSubmit = async (data) => {
    if (editing) {
      await nhaCungCapService.update(data);
    } else {
      await nhaCungCapService.create(data);
    }
    setShowForm(false);
    fetchList();
  };

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>
      {isNhanVien ? <h2 style={{ marginBottom: 24 }}>Quản lý Nhà cung cấp</h2>: <h2 style={{ marginBottom: 24 }}>Danh sách Nhà cung cấp</h2>}
      {isNhanVien && (<button onClick={handleAdd} style={{ marginBottom: 16, padding: '8px 16px', background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
        Thêm mới Nhà cung cấp
      </button>)}
      <NhaCungCapTable list={list} onEdit={handleEdit} onDelete={handleDelete} />
      {showForm && (
        <NhaCungCapForm initial={editing} onSubmit={handleSubmit} onClose={() => setShowForm(false)} />
      )}
    </div>
  );
};

export default NhaCungCapPage;
