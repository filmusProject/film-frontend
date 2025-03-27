import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

/**
 * Layout 컴포넌트는 Filmus 전체 페이지에서 공통적으로 사용되는 UI 구조입니다.
 * 상단 헤더(로고 및 메뉴) + children 콘텐츠 + 하단 푸터로 구성되어 있습니다.
 */
const Layout = ({ children }) => {
    const [keyword, setKeyword] = useState('');
    const navigate = useNavigate();

    const handleSearch = () => {
        if (keyword.trim()) {
            navigate(`/search?query=${encodeURIComponent(keyword.trim())}`);
        }
    };

    return (
        <div className="min-h-screen bg-[#121212] text-white font-sans flex flex-col">
            {/* 상단 네비게이션 바 */}
            <header className="bg-[#1E1E1E] w-full z-50">
                <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0">
                            <img className="h-8" src="https://ai-public.creatie.ai/gen_page/logo_placeholder.png" alt="Filmus" />
                        </Link>
                    </div>

                    {/* ✅ 검색창 */}
                    <div className="flex-1 max-w-2xl mx-8">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="영화 제목, 키워드, 감독을 입력하세요"
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                className="w-full bg-[#2A2A2A] border-0 rounded-button pl-10 pr-16 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-custom"
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <i className="fas fa-search text-gray-400" />
                            </div>
                            <button
                                onClick={handleSearch}
                                className="absolute inset-y-0 right-2 px-3 py-1 text-sm text-gray-300 hover:text-white"
                            >
                                검색
                            </button>
                        </div>
                    </div>

                    {/* ✅ 메뉴 */}
                    <div className="hidden md:flex space-x-4">
                        <Link to="/recommend" className="text-gray-300 hover:text-white px-3 py-2 rounded-button text-sm font-medium">추천</Link>
                        <Link to="/together" className="text-gray-300 hover:text-white px-3 py-2 rounded-button text-sm font-medium">같이보기</Link>
                        <Link to="/mypage" className="text-gray-300 hover:text-white px-3 py-2 rounded-button text-sm font-medium">MY</Link>
                        <Link to="/login" className="bg-custom text-white px-4 py-2 rounded-button text-sm font-medium">로그인</Link>
                    </div>
                </div>
            </header>

            {/* 본문 영역 */}
            <main className="flex-grow w-full max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {children}
            </main>

            {/* 푸터 */}
            <footer className="bg-[#1E1E1E] mt-auto">
                <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-400 text-sm">© 2024 Filmus. All rights reserved.</p>
                    <div className="flex space-x-6">
                        <a href="#" className="text-gray-400 hover:text-white"><i className="fab fa-twitter"></i></a>
                        <a href="#" className="text-gray-400 hover:text-white"><i className="fab fa-instagram"></i></a>
                        <a href="#" className="text-gray-400 hover:text-white"><i className="fab fa-facebook"></i></a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Layout;