import axios from 'axios';

const userId = localStorage.getItem('userId');

const axiosInstance = axios.create({
  baseURL: 'https://prodappback.onrender.com', 
  headers: {
    'Content-Type': 'application/json',
    'user-id': userId,
  },
});

export default axiosInstance;
