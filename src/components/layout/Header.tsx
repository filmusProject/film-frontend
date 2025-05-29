/* -------------------------------------------
   src/components/layout/Header.tsx
------------------------------------------- */
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import MobileDrawer from "./MobileDrawer";

const Header: React.FC = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { theme, toggleTheme } = useTheme();

    const [drawerOpen, setDrawerOpen] = useState(false);

    const handleLogin = () => navigate("/login");
    const gotoMyPage = () => navigate("/mypage");

    const bg = theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-800";

    return (
        <>
            <header className={`sticky top-0 z-50 ${bg} shadow-md`}>
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    {/* 로고 */}
                    <h1>
                        <Link to="/" className="text-2xl font-bold text-[#FF574F]">
                            Filmus
                        </Link>
                    </h1>

                    {/* 데스크탑 메뉴 */}
                    <nav className="hidden md:block">
                        <ul className="flex space-x-8">
                            <li><Link to="/"        className="hover:text-[#FF574F]">홈</Link></li>
                            <li><Link to="/search"  className="hover:text-[#FF574F]">검색</Link></li>
                            <li><Link to="/recommend" className="hover:text-[#FF574F]">추천</Link></li>
                        </ul>
                    </nav>

                    {/* 우측 액션 */}
                    <div className="flex items-center space-x-4">
                        {/* 다크모드 */}
                        <button onClick={toggleTheme} className="p-2 text-xl">
                            {theme === "dark" ? <i className="fas fa-sun text-yellow-300" /> : <i className="fas fa-moon" />}
                        </button>

                        {/* 로그인 / 마이페이지 (md 이상 노출) */}
                        {isAuthenticated ? (
                            <button
                                onClick={gotoMyPage}
                                className="hidden md:flex w-10 h-10 items-center justify-center rounded-full bg-[#FF574F] text-white"
                            >
                                <i className="fas fa-user" />
                            </button>
                        ) : (
                            <button
                                onClick={handleLogin}
                                className="hidden md:block bg-[#FF574F] text-white px-4 py-2 rounded-full text-sm"
                            >
                                로그인
                            </button>
                        )}

                        {/* 햄버거 (모바일) */}
                        <button
                            onClick={() => setDrawerOpen(true)}
                            className="md:hidden p-2 text-2xl"
                            aria-label="Open menu"
                        >
                            <i className="fas fa-bars" />
                        </button>
                    </div>
                </div>
            </header>

            {/* 모바일 드로어 */}
            <MobileDrawer
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                isAuthenticated={isAuthenticated}
                onLogin={handleLogin}
            />
        </>
    );
};

export default Header;