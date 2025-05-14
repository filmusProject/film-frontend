import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";

const Footer: React.FC = () => {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    /** 모바일 accordion용 섹션 데이터 */
    const sections = [
        {
            title: "탐색",
            links: [
                { to: "/search", label: "영화" },
                { to: "/search?type=tv", label: "TV 프로그램" },
                { to: "/search?type=actor", label: "배우" },
                { to: "/search?type=director", label: "감독" },
                { to: "/genres", label: "장르" },
            ],
        },
        {
            title: "내 계정",
            links: [
                { to: "/mypage", label: "내 프로필" },
                { to: "/mypage/bookmarks", label: "찜 목록" },
                { to: "/mypage/reviews", label: "리뷰" },
                { to: "/mypage/settings", label: "설정" },
                { to: "/help", label: "도움말" },
            ],
        },
        {
            title: "정책",
            links: [
                { to: "/terms", label: "이용 약관" },
                { to: "/privacy", label: "개인정보 처리방침" },
                { to: "/cookies", label: "쿠키 정책" },
                { to: "/gdpr", label: "GDPR 준수" },
                { to: "/content-policy", label: "콘텐츠 정책" },
            ],
        },
    ];

    return (
        <footer className={`py-12 ${isDark ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-600"}`}>
            <div className="mx-auto max-w-screen-xl px-6">
                {/* 데스크톱 레이아웃 */}
                <div className="hidden md:grid grid-cols-4 gap-8">
                    {/* 브랜드 & SNS */}
                    <div>
                        <h3 className="text-xl font-bold mb-4 text-[#FF574F]">Filmus</h3>
                        <p className="mb-6 leading-relaxed">
                            영화 팬들을 위한 최고의 공간. 영화 검색, 리뷰 작성, 공유까지 모두 한 곳에서!
                        </p>

                        <div className="flex space-x-4">
                            {["facebook-f", "twitter", "instagram", "youtube"].map((icon) => (
                                <a key={icon} href="#" aria-label={icon}>
                  <span className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center hover:bg-[#FF574F] transition-colors">
                    <i className={`fab fa-${icon} text-gray-600 dark:text-gray-300 hover:text-white transition-colors`} />
                  </span>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* 링크 섹션 */}
                    {sections.map(({ title, links }) => (
                        <div key={title}>
                            <h4 className="font-bold mb-4">{title}</h4>
                            <ul className="space-y-2">
                                {links.map(({ to, label }) => (
                                    <li key={label}>
                                        <Link to={to} className="hover:text-[#FF574F]">{label}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* 모바일 아코디언 */}
                <div className="md:hidden space-y-6">
                    {/* 브랜드 & SNS (모바일) */}
                    <div>
                        <h3 className="text-xl font-bold mb-4 text-[#FF574F]">Filmus</h3>
                        <p className="mb-6">
                            영화 팬들을 위한 최고의 공간. 영화 검색, 리뷰 작성, 공유까지 모두 한 곳에서!
                        </p>
                        <div className="flex space-x-4 mb-4">
                            {["facebook-f", "twitter", "instagram", "youtube"].map((icon) => (
                                <a key={icon} href="#" aria-label={icon}>
                  <span className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center hover:bg-[#FF574F] transition-colors">
                    <i className={`fab fa-${icon} text-gray-600 dark:text-gray-300 hover:text-white transition-colors`} />
                  </span>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* 각 섹션을 details/summary 아코디언으로 */}
                    {sections.map(({ title, links }) => (
                        <details key={title} className="border-b border-gray-300 dark:border-gray-700 py-2">
                            <summary className="font-medium text-lg cursor-pointer flex justify-between items-center">
                                {title}
                                <span className="text-xl">▾</span>
                            </summary>
                            <ul className="mt-3 space-y-2 pl-1">
                                {links.map(({ to, label }) => (
                                    <li key={label}>
                                        <Link to={to} className="hover:text-[#FF574F]">{label}</Link>
                                    </li>
                                ))}
                            </ul>
                        </details>
                    ))}
                </div>

                {/* 하단 저작권 */}
                <div className="mt-12 pt-8 border-t border-gray-300 dark:border-gray-700 text-center">
                    &copy; 2025 Filmus. 모든 권리 보유.
                </div>
            </div>
        </footer>
    );
};

export default Footer;