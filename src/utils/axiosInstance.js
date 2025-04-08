// src/utils/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://api.filmus.o-r.kr/api',
    withCredentials: true, // refreshToken 쿠키 전송 허용
});

// 요청 전에 accessToken을 헤더에 추가
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            localStorage.removeItem('accessToken');
            window.location.href = navigate('/login')
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;