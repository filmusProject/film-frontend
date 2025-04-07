// src/api/auth.js
// 로그인 및 로그아웃 관련 API 요청 함수

import axios from '../utils/axiosInstance';

/**
 * 로그인 요청 함수
 * @param {Object} form - 사용자 입력 값 { username, password }
 * @returns {Promise<Response>}
 */
export const login = async (form) => {
    // 백엔드로 로그인 요청 보냄
    const response = await axios.post('/auth/login', form, {
        withCredentials: true, // ✅ Refresh Token을 쿠키로 받기 위해 설정
    });

    // Access Token은 응답의 body 또는 헤더에 포함될 수 있음
    const accessToken = response.data.accessToken || response.headers['authorization'];

    // Access Token을 localStorage에 저장
    if (accessToken) {
        localStorage.setItem('accessToken', accessToken);
    }

    return response;
};

/**
 * 로그아웃 요청 함수
 */
export const logout = async () => {
    // 서버에 refresh token 삭제 요청
    await axios.post('/auth/logout', {}, { withCredentials: true });

    // 클라이언트에서도 access token 제거
    localStorage.removeItem('accessToken');
};