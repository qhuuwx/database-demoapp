import axios from 'axios';
const API_URL = 'http://localhost:5000/api/auth';

const authService = {
  login: async (data) => {
    const res = await axios.post(`${API_URL}/login`, data);
    return res.data;
  },
  register: async (data) => {
    const res = await axios.post(`${API_URL}/register`, data);
    return res.data;
  },
  getCurrentUser: async (token) => {
    const res = await axios.get(`${API_URL}/me`, { headers: { Authorization: `Bearer ${token}` } });
    return res.data;
  }
};
export default authService;
