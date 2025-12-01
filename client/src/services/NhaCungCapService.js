import axios from 'axios';

const API_URL = 'http://192.168.0.178:5000/api/nhacungcap/';

const nhaCungCapService = {
  getAll: async () => {
    const res = await axios.get(API_URL);
    return res.data;
  },
  create: async (data) => {
    const res = await axios.post(API_URL, data);
    return res.data;
  },
  update: async (data) => {
    const res = await axios.put(API_URL, data);
    console.log('Update response:', res.data);
    return res.data;
  },
  remove: async (id) => {
    const res = await axios.delete(`${API_URL}/${id}`);
    return res.data;
  },
  searchSanPham: async (tuKhoaTenNCC) => {
    const res = await axios.get(`${API_URL}search-products`, {
      params: { tuKhoaTenNCC }
    });
    return res.data;
  },
  thongKeTheoKhuVuc: async (thanhPho, soLuongToiThieu) => {
    const res = await axios.get(`${API_URL}statistics`, {
      params: { thanhPho, soLuongToiThieu }
    });
    return res.data;
  }
};

export default nhaCungCapService;
