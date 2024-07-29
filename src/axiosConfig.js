import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://prodappback.onrender.com';


const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
