import React from 'react';
import { Routes, Route } from 'react-router-dom';



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
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/movie-detail" element={<MovieDetailPage />} />
      <Route path="/recommend" element={<RecommendPage />} />
      <Route path="/together" element={<TogetherPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/mypage" element={<Mypage />} />
      <Route path="/find-username" element={<FindUsernamePage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/change-password" element={<ChangePasswordPage />} />
    </Routes>
  );
}

export default App;
