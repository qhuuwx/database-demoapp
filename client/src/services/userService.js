import axios from 'axios';
const API_URL = 'http://localhost:5000/api/admin';

const userService = {
  getAllUsers: async (token) => {
    const res = await axios.get(`${API_URL}/users`, { headers: { Authorization: `Bearer ${token}` } });
    return res.data;
  },
  updateUserRole: async (id, role, token) => {
    await axios.patch(`${API_URL}/users/${id}/role`, { VaiTro: role }, { headers: { Authorization: `Bearer ${token}` } });
  },
  updateUserStatus: async (id, status, token) => {
    await axios.patch(`${API_URL}/users/${id}/status`, { TrangThai: status }, { headers: { Authorization: `Bearer ${token}` } });
  }
};
export default userService;
