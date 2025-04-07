// src/components/Layout.jsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Layout = ({ children }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    return (
        <div className="min-h-screen bg-[#121212] text-white font-sans flex flex-col">
            {/* 상단 네비게이션 바 */}
            <header className="bg-[#1E1E1E] w-full z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
                    {/* 로고 */}
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0">
                            <img
                                className="h-8"
                                src="https://ai-public.creatie.ai/gen_page/logo_placeholder.png"
                                alt="Filmus"
                            />
                        </Link>
                    </div>

                    {/* 햄버거 메뉴 (모바일용) */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="text-gray-300 hover:text-white"
                        >
                            <i className="fas fa-bars text-xl"></i>
                        </button>
                    </div>

                    {/* 데스크탑 메뉴 */}
                    <div className="hidden md:flex space-x-4">
                        <Link
                            to="/recommend"
                            className="text-gray-300 hover:text-white px-3 py-2 rounded-button text-sm font-medium"
                        >
                            추천
                        </Link>
                        <Link
                            to="/together"
                            className="text-gray-300 hover:text-white px-3 py-2 rounded-button text-sm font-medium"
                        >
                            같이보기
                        </Link>
                        {/* 새로 추가된 “검색” 버튼 */}
                        <Link
                            to="/search"
                            className="text-gray-300 hover:text-white px-3 py-2 rounded-button text-sm font-medium"
                        >
                            검색
                        </Link>

                        {isAuthenticated ? (
                            <Link
                                to="/mypage"
                                className="text-gray-300 hover:text-white px-3 py-2 rounded-button text-sm font-medium"
                            >
                                MY
                            </Link>
                        ) : (
                            <Link
                                to="/login"
                                className="bg-custom text-white px-4 py-2 rounded-button text-sm font-medium"
                            >
                                로그인
                            </Link>
                        )}
                    </div>
                </div>

                {/* 모바일 메뉴 */}
                {menuOpen && (
                    <div className="md:hidden px-4 pt-2 pb-4 space-y-2 bg-[#1E1E1E]">
                        <Link
                            to="/recommend"
                            className="block text-gray-300 hover:text-white text-sm"
                        >
                            추천
                        </Link>
                        <Link
                            to="/together"
                            className="block text-gray-300 hover:text-white text-sm"
                        >
                            같이보기
                        </Link>
                        <Link
                            to="/search"
                            className="block text-gray-300 hover:text-white text-sm"
                        >
                            검색
                        </Link>
                        {isAuthenticated ? (
                            <Link
                                to="/mypage"
                                className="block text-gray-300 hover:text-white text-sm"
                            >
                                MY
                            </Link>
                        ) : (
                            <Link
                                to="/login"
                                className="block text-white bg-custom rounded px-4 py-2 text-sm"
                            >
                                로그인
                            </Link>
                        )}
                    </div>
                )}
            </header>

            {/* 메인 콘텐츠 영역 */}
            <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {children}
            </main>

            {/* 하단 푸터 */}
            <footer className="bg-[#1E1E1E] mt-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-400 text-sm">
                        © 2024 Filmus. All rights reserved.
                    </p>
                    <div className="flex space-x-6">
                        <a href="#" className="text-gray-400 hover:text-white">
                            <i className="fab fa-twitter"></i>
                        </a>
                        <a href="#" className="text-gray-400 hover:text-white">
                            <i className="fab fa-instagram"></i>
                        </a>
                        <a href="#" className="text-gray-400 hover:text-white">
                            <i className="fab fa-facebook"></i>
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Layout;