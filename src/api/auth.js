// src/api/auth.js
import axiosInstance from '../utils/axiosInstance';

// 로그인 요청
export const login = async (email, password) => {
    const response = await axiosInstance.post(
        '/auth/login',
        { email, password },
        { withCredentials: true }
    );

    // 응답 헤더에서 accessToken 추출
    const accessToken = response.headers['authorization']?.split(' ')[1];

    if (accessToken) {
        localStorage.setItem('accessToken', accessToken);
    }

    return response.data;
};

// 사용자 정보 요청 (GET /user/me)
export const getMyInfo = async () => {
    const response = await axiosInstance.get('/user/me');
    return response.data;
};

// 로그아웃
export const logout = async () => {
    localStorage.removeItem('accessToken');
    await axiosInstance.post('/auth/logout', {}, { withCredentials: true });
};