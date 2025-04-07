// src/routes/ProtectedRoute.jsx
// 로그인된 사용자만 접근할 수 있도록 막는 보호 라우트

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * 사용자가 로그인하지 않은 상태라면 /login 페이지로 리다이렉트합니다.
 * 로그인된 상태라면 children 컴포넌트를 그대로 렌더링합니다.
 */
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;