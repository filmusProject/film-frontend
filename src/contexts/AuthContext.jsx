// src/contexts/AuthContext.jsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import * as authAPI from '../api/auth';
import axios from '../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';

// 1. Context 생성
const AuthContext = createContext();

// 2. Provider 컴포넌트 정의
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // 최초 마운트 시 로그인 상태 확인
    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            setLoading(false);
            return;
        }

        axios.get('/user/me')
            .then((res) => {
                setUser(res.data);
            })
            .catch(() => {
                localStorage.removeItem('accessToken');
                setUser(null);
            })
            .finally(() => setLoading(false));
    }, []);

    // 로그인 처리
    const login = async (form) => {
        // ✅ 로그인 시 액세스 토큰 저장 및 유저 정보 요청
        const response = await authAPI.login(form);
        const token = response?.headers?.authorization?.split(' ')[1];
        if (token) {
            localStorage.setItem('accessToken', token); // ✅ 저장 명확히
            const res = await axios.get('/user/me');
            setUser(res.data);                          // ✅ user 상태 업데이트 → 리렌더 유도\
        }
    };

    const logout = async () => {
        try {
            await axios.post('/auth/logout'); // ✅ 먼저 로그아웃 요청
        } catch (err) {
            // 로그아웃 요청은 실패해도 무시 가능 (예: 이미 만료된 토큰)
            console.warn('로그아웃 요청 중 에러 (무시 가능):', err);
        } finally {
            localStorage.removeItem('accessToken'); // ✅ 토큰 제거는 마지막에
            setUser(null);
            navigate('/');
        }
    };

    const isAuthenticated = !!user;

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);