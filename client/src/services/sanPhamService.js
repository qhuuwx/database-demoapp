import axios from 'axios';

const API_URL = 'http://localhost:5000/api/sanpham/';

const sanPhamService = {
  getAll: async (token) => {
    const res = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  },
  create: async (data, token) => {
    const res = await axios.post(API_URL, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  },
  update: async (data, token) => {
    const res = await axios.put(API_URL, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  },
  remove: async (id, token) => {
    const res = await axios.delete(`${API_URL}${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  },
  searchSanPhamTheoNCC: async (tuKhoaTenNCC, token) => {
    const res = await axios.get(`${API_URL}search/${tuKhoaTenNCC}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  },
  filter: async (filters, token) => {
    const res = await axios.get(`${API_URL}filter`, {
      params: filters,
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  }
};

export default sanPhamService;
