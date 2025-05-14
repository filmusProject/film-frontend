/* -------------------------------------------
   src/pages/ResetPasswordEmailPage.tsx
   ------------------------------------------- */
import React, { useState } from 'react';
import { Link }           from 'react-router-dom';
import Layout             from '../components/layout/Layout';
import axios              from '../utils/axiosInstance';

const ResetPasswordEmailPage: React.FC = () => {
    const [email,     setEmail]     = useState('');
    const [loading,   setLoading]   = useState(false);
    const [sent,      setSent]      = useState(false);
    const [errorMsg,  setErrorMsg]  = useState('');

    /* --------------- 제출 --------------- */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');
        setSent(false);

        if (!email.trim()) return setErrorMsg('이메일을 입력해주세요.');
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
            return setErrorMsg('올바른 이메일 형식이 아닙니다.');

        try {
            setLoading(true);
            await axios.post('/api/user/password/reset', { email });
            setSent(true);
            setEmail('');
        } catch (err: any) {
            setErrorMsg(
                err.response?.data?.message ||
                '메일 발송 중 문제가 발생했습니다.',
            );
        } finally {
            setLoading(false);
        }
    };

    /* --------------- UI --------------- */
    return (
        <Layout>
            <div className="min-h-screen flex items-center justify-center
                      bg-gradient-to-br from-gray-50 to-gray-100
                      dark:from-gray-900 dark:to-gray-800 p-4">
                <div
                    className="w-full max-w-md backdrop-blur-xl backdrop-saturate-150
                     bg-white/70 dark:bg-gray-800/50 border border-white/20
                     rounded-xl shadow-lg p-8 font-['Poppins']"
                >
                    <header className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                            비밀번호 초기화
                        </h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-300 text-sm">
                            가입한 이메일로 임시 비밀번호를 보내드립니다.
                        </p>
                    </header>

                    {sent ? (
                        <div className="text-center space-y-6">
                            <i className="fas fa-envelope-open-text text-4xl text-[#FF574F]" />
                            <p className="text-gray-700 dark:text-gray-200 text-sm">
                                메일이 전송되었습니다! <br />
                                받은편지함을 확인해주세요.
                            </p>
                            <Link
                                to="/login"
                                className="text-[#FF574F] hover:underline transition"
                            >
                                로그인 화면으로
                            </Link>
                        </div>
                    ) : (
                        <form
                            onSubmit={handleSubmit}
                            className={`space-y-6 ${errorMsg && 'animate-shake'}`}
                        >
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block mb-1 text-sm font-medium
                             text-gray-700 dark:text-gray-300"
                                >
                                    이메일 주소
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border-none
                             focus:ring-2 focus:ring-[#FF574F]
                             bg-white/50 dark:bg-gray-700/50 text-sm"
                                    placeholder="example@domain.com"
                                />
                            </div>

                            {errorMsg && (
                                <p className="text-red-500 text-sm font-medium">{errorMsg}</p>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#FF574F] hover:bg-[#e64940] text-white
                           font-medium py-3 rounded-lg transition active:scale-95"
                            >
                                {loading ? (
                                    <span className="animate-pulse">전송 중…</span>
                                ) : (
                                    '임시 비밀번호 메일 발송'
                                )}
                            </button>
                        </form>
                    )}

                    {/* 하단 링크 */}
                    <div className="mt-8 text-center text-sm">
                        <Link to="/login"  className="text-[#FF574F] hover:underline">로그인</Link>
                        <span className="text-gray-400 mx-2">|</span>
                        <Link to="/signup" className="text-[#FF574F] hover:underline">회원가입</Link>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default ResetPasswordEmailPage;