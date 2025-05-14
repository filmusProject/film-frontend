/* -------------------------------------------
   src/pages/FindUsernamePage.tsx      (Tailwind + glass‑UI)
   ------------------------------------------- */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import axios  from '../utils/axiosInstance';

const FindUsernamePage: React.FC = () => {
  /* ---------- 상태 ---------- */
  const [email, setEmail]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState(false);
  const navigate                = useNavigate();

  /* ---------- 제출 ---------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!email.trim()) {
      setError('이메일을 입력해주세요.');
      return;
    }

    try {
      setLoading(true);
      await axios.post('/auth/find-username', { email });

      /* ✅ 서버에서 “메일 발송 완료” 응답이 오면 */
      setSuccess(true);
      setEmail('');
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError('등록된 이메일을 찾을 수 없습니다.');
      } else {
        setError('요청 처리 중 오류가 발생했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  /* ---------- UI ---------- */
  return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 font-['Poppins']">
          <div className="w-full max-w-md backdrop-blur-xl backdrop-saturate-150 bg-white/70 dark:bg-gray-800/50 border border-white/20 rounded-xl shadow-lg p-8">

            {/* -------- 헤더 -------- */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                Filmus
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                가입 시 등록한 이메일로&nbsp;
                <span className="font-semibold text-[#FF574F]">아이디</span>를 보내드립니다
              </p>
            </div>

            {/* -------- 성공 화면 -------- */}
            {success ? (
                <div className="text-center">
                  <div className="mb-6 mx-auto w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <i className="fas fa-check text-green-500 text-2xl" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                    이메일 전송 완료
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-8">
                    입력하신 주소로 아이디를 안내해 드렸습니다. 메일을 확인해주세요!
                  </p>
                  <button
                      onClick={() => navigate('/login')}
                      className="px-6 py-3 bg-[#FF574F] text-white rounded-lg font-medium hover:bg-[#e64940] active:scale-95 transition"
                  >
                    로그인 화면으로 이동
                  </button>
                </div>
            ) : (
                /* -------- 폼 -------- */
                <form
                    onSubmit={handleSubmit}
                    className={`space-y-6 ${error && 'animate-shake'}`}
                >
                  <div>
                    <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      이메일 주소
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`w-full px-4 py-3 rounded-lg border-none focus:ring-2 focus:ring-[#FF574F] bg-white/50 dark:bg-gray-700/50 text-sm ${error ? 'ring-2 ring-red-500' : ''}`}
                        placeholder="example@domain.com"
                    />
                  </div>

                  {error && (
                      <p className="text-red-500 text-sm font-medium">{error}</p>
                  )}

                  <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-[#FF574F] hover:bg-[#e64940] text-white font-medium py-3 rounded-lg transition active:scale-95"
                  >
                    {loading ? (
                        <span className="flex items-center justify-center">
                    <i className="fas fa-spinner fa-spin mr-2" />
                    처리 중…
                  </span>
                    ) : (
                        '아이디 전송'
                    )}
                  </button>
                </form>
            )}

            {/* -------- 하단 링크 -------- */}
            {!success && (
                <>
                  <Divider />
                  <nav className="mt-6 flex justify-center space-x-4 text-sm">
                    <LinkBtn to="/signup">회원가입</LinkBtn>
                    <span className="text-gray-400">|</span>
                    <LinkBtn to="/reset-password">비밀번호 재설정</LinkBtn>
                    <span className="text-gray-400">|</span>
                    <LinkBtn to="/login">로그인</LinkBtn>
                  </nav>
                </>
            )}
          </div>
        </div>
      </Layout>
  );
};

/* ---------- 재사용 컴포넌트 ---------- */
const Divider = () => (
    <div className="mt-10 relative">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-gray-300 dark:border-gray-700" />
      </div>
      <div className="relative flex justify-center text-sm">
      <span className="px-4 bg-white/70 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400">
        도움이 필요하신가요?
      </span>
      </div>
    </div>
);

const LinkBtn: React.FC<{ to: string; children: React.ReactNode }> = ({
                                                                        to,
                                                                        children,
                                                                      }) => (
    <Link to={to} className="text-[#FF574F] hover:underline cursor-pointer">
      {children}
    </Link>
);

export default FindUsernamePage;