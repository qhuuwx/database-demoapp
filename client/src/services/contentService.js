import axios from 'axios';
const API_URL = 'http://192.168.0.178:5000/api/contents';

const contentService = {
  getContents: async (token) => {
    const res = await axios.get(API_URL, { headers: { Authorization: `Bearer ${token}` } });
    return res.data;
  },
  createContent: async (data, token) => {
    await axios.post(API_URL, data, { headers: { Authorization: `Bearer ${token}` } });
  },
  updateContent: async (id, data, token) => {
    await axios.put(`${API_URL}/${id}`, data, { headers: { Authorization: `Bearer ${token}` } });
  },
  deleteContent: async (id, token) => {
    await axios.delete(`${API_URL}/${id}`, { headers: { Authorization: `Bearer ${token}` } });
  }
};
export default contentService;
