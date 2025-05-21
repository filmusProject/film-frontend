// src/App.tsx

import React from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";

import HomePage from "./pages/HomePage"; // ✅ 이제 정상 인식
import SearchPage from "./pages/SearchPage";
import MovieDetailPage from "./pages/MovieDetailPage";
// import RecommendPage from "./pages/RecommendPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Mypage from "./pages/Mypage";
import FindUsernamePage from "./pages/FindUsernamePage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import PlotSearchPage from "./pages/PlotSearchPage";

function App() {
    return (
        <AuthProvider>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/movie-detail" element={<MovieDetailPage />} />
                {/*<Route path="/recommend" element={<RecommendPage />} />*/}
                {/*<Route path="/together" element={<TogetherPage />} />*/}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/find-username" element={<FindUsernamePage />} />
                <Route path="/plot-search" element={<PlotSearchPage />} />
                {/*<Route path="/reset-password" element={<ResetPasswordPage />} />*/}
                <Route path="/password/reset" element={<ResetPasswordPage />} />
                <Route path="/password/change"      element={<ChangePasswordPage />} />
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