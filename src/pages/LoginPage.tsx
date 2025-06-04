/* -------------------------------------------
   src/pages/LoginPage.tsx  (redirect 버전)
   ------------------------------------------- */
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout       from "../components/layout/Layout";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth }  from "../contexts/AuthContext";

/**
 * 🔗 카카오 OAuth2 로그인 시작 URL (리디렉션)
 */
const KAKAO_LOGIN_URL = "https://api.filmus.o-r.kr/oauth2/authorization/kakao";

const LoginPage: React.FC = () => {
    /* ---------- 상태 ---------- */
    const [email, setEmail]       = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading]   = useState(false);
    const [error, setError]       = useState("");
    const navigate                = useNavigate();
    const { theme }               = useTheme();
    const { login }               = useAuth();

    /* ---------- 제출 ---------- */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) return setError("모든 항목을 입력해주세요.");
        setError("");
        try {
            setLoading(true);
            await login({ email, password });
            navigate("/");
        } catch (err: any) {
            const code = err?.response?.data?.code;
            setError(
                code === "INVALID_CREDENTIALS"
                    ? "아이디 또는 비밀번호가 올바르지 않습니다."
                    : "로그인 중 문제가 발생했습니다.",
            );
        } finally {
            setLoading(false);
        }
    };

    /* ---------- UI ---------- */
    return (
        <Layout>
            {/* 🔸 전체 화면 중앙 정렬 */}
            <div
                className={`fixed inset-0 flex items-center justify-center ${
                    theme === "dark"
                        ? "bg-gradient-to-br from-gray-900 to-gray-800"
                        : "bg-gradient-to-br from-gray-50 to-gray-100"
                }`}
            >
                {/* 카드 */}
                <div
                    className={`w-[min(90vw,28rem)] sm:w-[24rem] backdrop-blur-xl backdrop-saturate-150 bg-white/70 dark:bg-gray-800/50 border border-white/20 shadow-lg rounded-xl p-8`}
                >
                    <header className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                            Filmus
                        </h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-300">
                            로그인하여 서비스를 이용해보세요
                        </p>
                    </header>

                    {/* 폼 */}
                    <form onSubmit={handleSubmit} className={`space-y-6 ${error && "animate-shake"}`}>
                        <Input
                            label="이메일"
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            error={!!error}
                            theme={theme}
                        />
                        <Input
                            label="비밀번호"
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            error={!!error}
                            theme={theme}
                        />

                        {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#FF574F] hover:bg-[#e64940] text-white font-medium py-3 rounded-lg transition active:scale-95"
                        >
                            {loading ? <span className="animate-pulse">로그인 중…</span> : "로그인"}
                        </button>
                    </form>

                    {/* 보조 링크 */}
                    <nav className="mt-6 flex justify-center space-x-4 text-sm">
                        <PageLink to="/signup">회원가입</PageLink>
                        <span className="text-gray-400">|</span>
                        <PageLink to="/find-username">아이디 찾기</PageLink>
                        <span className="text-gray-400">|</span>
                        <PageLink to="/password/reset">비밀번호 재설정</PageLink>
                    </nav>

                    {/* 구분선 & 카카오 로그인 */}
                    <Divider theme={theme} />
                    <KakaoButton />
                </div>
            </div>
        </Layout>
    );
};

/* ------ 재사용 컴포넌트들 ------ */
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    id: string;
    error: boolean;
    theme: "light" | "dark";
}
const Input: React.FC<InputProps> = ({ label, id, error, theme, ...rest }) => (
    <div>
        <label htmlFor={id} className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
        </label>
        <input
            id={id}
            className={`w-full px-4 py-3 rounded-lg border-none focus:ring-2 focus:ring-[#FF574F] ${
                theme === "dark" ? "bg-gray-700/50 text-white" : "bg-white/50 text-black"
            } text-sm ${error && "ring-2 ring-red-500"}`}
            {...rest}
        />
    </div>
);

const PageLink: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => (
    <Link to={to} className="text-[#FF574F] hover:underline">
        {children}
    </Link>
);

const Divider: React.FC<{ theme: "light" | "dark" }> = ({ theme }) => (
    <div className="mt-8 relative">
        <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-700" />
        </div>
        <div className="relative flex justify-center text-sm">
      <span
          className={`px-4 ${
              theme === "dark" ? "bg-gray-800/50 text-gray-400" : "bg-white/70 text-gray-500"
          }`}
      >
        또는
      </span>
        </div>
    </div>
);

/**
 * 카카오 버튼 – 클릭 시 전체 페이지 리디렉션
 */
const KakaoButton: React.FC = () => (
    <a
        href={KAKAO_LOGIN_URL}
        className="mt-6 w-full bg-[#FEE500] text-gray-800 font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition active:scale-95"
    >
        <i className="fas fa-comment text-gray-800" />
        <span>카카오로 계속하기</span>
    </a>
);

export default LoginPage;
