import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://prodappback.onrender.com', // Replace with your backend URL

  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
