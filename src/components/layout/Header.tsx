/* -------------------------------------------
   src/components/layout/Header.tsx
------------------------------------------- */
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { theme, toggleTheme } = useTheme();

    /* -------- 핸들러 -------- */
    const handleLogin = () => navigate("/login");
    const gotoMyPage  = () => navigate("/mypage");

    return (
        <header
            className={`sticky top-0 z-50 ${
                theme === "dark"
                    ? "bg-gray-800 text-white"
                    : "bg-white text-gray-800"
            } shadow-md`}
        >
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                {/* --- 로고 & 내비 --- */}
                <div className="flex items-center">
                    <h1><Link to="/"        className="text-2xl font-bold text-[#FF574F]">
                        Filmus
                    </Link></h1>
                    <nav className="ml-8 hidden md:block">
                        <ul className="flex space-x-6">
                            <li>
                                <Link to="/"        className="hover:text-[#FF574F] transition-colors">
                                    홈
                                </Link>
                            </li>
                            <li>
                                <Link to="/search"  className="hover:text-[#FF574F] transition-colors">
                                    검색
                                </Link>
                            </li>
                            <li>
                                <Link to="/recommend" className="hover:text-[#FF574F] transition-colors">
                                    추천
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </div>

                {/* --- 우측 액션 --- */}
                <div className="flex items-center space-x-4">
                    {/* 다크모드 토글 */}
                    <button onClick={toggleTheme} className="p-2 rounded-full">
                        {theme === "dark" ? (
                            <i className="fas fa-sun text-yellow-400"></i>
                        ) : (
                            <i className="fas fa-moon text-gray-600"></i>
                        )}
                    </button>

                    {/* 로그인 / 마이페이지 */}
                    {isAuthenticated ? (
                        <button
                            onClick={gotoMyPage}
                            className="w-10 h-10 flex items-center justify-center rounded-full bg-[#FF574F] text-white hover:bg-opacity-90 transition"
                        >
                            <i className="fas fa-user text-lg"></i>
                        </button>
                    ) : (
                        <button
                            onClick={handleLogin}
                            className="bg-[#FF574F] text-white px-4 py-2 rounded-full text-sm hover:bg-opacity-90 transition"
                        >
                            로그인
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;