// ✅ 로그인 / 로그아웃 기능을 담당하는 auth 서비스
import axios from '../utils/axiosInstance';

export const login = async ({ username, password }) => {
    const response = await axios.post('/auth/login', { username, password });

    // access token을 응답 헤더 또는 body에서 받음
    const accessToken = response.data.accessToken || response.headers['authorization'];
    if (accessToken) {
        localStorage.setItem('accessToken', accessToken);
    }
    return response;
};

export const logout = async () => {
    await axios.post('/auth/logout');
    localStorage.removeItem('accessToken');
};