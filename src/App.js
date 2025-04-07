import React from 'react';
import { Routes, Route } from 'react-router-dom'; // BrowserRouter ❌ 쓰지 말 것!
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';

import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import MovieDetailPage from './pages/MovieDetailPage';
import RecommendPage from './pages/RecommendPage';
import TogetherPage from './pages/TogetherPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Mypage from './pages/Mypage';
import FindUsernamePage from './pages/FindUsernamePage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ChangePasswordPage from './pages/ChangePasswordPage';

function App() {
    return (
        <AuthProvider>
            <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/movie-detail/:movieId/:movieSeq" element={<MovieDetailPage />} />
          <Route path="/recommend" element={<RecommendPage />} />
          <Route path="/together" element={<TogetherPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/find-username" element={<FindUsernamePage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* 🔐 보호된 라우트 */}
          <Route path="/mypage" element={
            <ProtectedRoute>
              <Mypage />
            </ProtectedRoute>
          } />
          <Route path="/change-password" element={
            <ProtectedRoute>
              <ChangePasswordPage />
            </ProtectedRoute>
          } />
            </Routes>
        </AuthProvider>
    );
}

export default App;

console.log("배포 확인용 v1.1");