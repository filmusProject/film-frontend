// src/contexts/AuthContext.jsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import * as authAPI from '../api/auth';
import axios from '../utils/axiosInstance';

// 1. Context 생성
const AuthContext = createContext();

// 2. Provider 컴포넌트 정의 (전역 상태 제공)
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // 앱 최초 로딩 시 로그인 상태 확인
    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            setLoading(false);
            return;
        }

        // accessToken이 있다면 사용자 정보 요청
        axios.get('/user/me')
            .then((res) => {
                setUser(res.data); // 로그인된 유저 정보 저장
            })
            .catch(() => {
                localStorage.removeItem('accessToken');
                setUser(null);
            })
            .finally(() => setLoading(false));
    }, []);

    // 로그인 처리
    const login = async (form) => {
        await authAPI.login(form);              // 로그인 요청
        const res = await axios.get('/user/me'); // 사용자 정보 재요청
        setUser(res.data);
    };

    // 로그아웃 처리
    const logout = async () => {
        await authAPI.logout();
        localStorage.removeItem('accessToken');
        setUser(null);
    };

    const isAuthenticated = !!user;

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

// 3. 커스텀 훅: 다른 컴포넌트에서 사용할 수 있도록 export
export const useAuth = () => useContext(AuthContext);