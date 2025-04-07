// src/pages/Mypage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';

const Mypage = () => {
  const { user, logout } = useAuth(); // logout 함수 불러오기

  const bookmarked = ['괴물', '기생충', '옥자'];
  const watched = ['인셉션', '인터스텔라', '어바웃타임'];

  const handleLogout = async () => {
    if (window.confirm('정말 로그아웃 하시겠습니까?')) {
      await logout();
      window.alert('로그아웃 되었습니다.');
      // 로그아웃 후 원하는 페이지로 이동할 수 있음
      // navigate('/');
    }
  };

  return (
      <Layout>
        <div className="min-h-screen bg-[#121212] text-white font-sans px-6 py-12">
          <div className="max-w-4xl mx-auto space-y-10">
            {/* 마이페이지 헤더 */}
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">👤 마이페이지</h1>
              <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-white text-sm font-medium"
              >
                로그아웃
              </button>
            </div>

            {/* 회원 정보 섹션 */}
            <section className="bg-[#1E1E1E] p-6 rounded-lg space-y-3">
              <h2 className="text-xl font-semibold mb-2 border-b border-gray-600 pb-2">회원 정보</h2>
              <div className="space-y-1">
                <p>
                  <span className="font-bold text-gray-300">아이디: </span>
                  <span>{user?.username || '-'}</span>
                </p>
                <p>
                  <span className="font-bold text-gray-300">이메일: </span>
                  <span>{user?.email || '-'}</span>
                </p>
                <p>
                  <span className="font-bold text-gray-300">닉네임: </span>
                  <span>{user?.nickname || '-'}</span>
                </p>
                <Link to="/change-password" className="text-sm text-custom hover:underline block mt-3">
                  비밀번호 변경
                </Link>
              </div>
            </section>

            {/* 찜한 영화 섹션 */}
            <section className="bg-[#1E1E1E] p-6 rounded-lg space-y-3">
              <h2 className="text-xl font-semibold border-b border-gray-600 pb-2">⭐ 찜한 영화</h2>
              {bookmarked.length === 0 ? (
                  <p className="text-gray-400 text-sm">아직 찜한 영화가 없습니다.</p>
              ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                    {bookmarked.map((title, idx) => (
                        <div
                            key={idx}
                            className="bg-[#2A2A2A] p-4 rounded-lg flex items-center justify-between hover:bg-[#2f2f2f] transition"
                        >
                          <span className="text-white font-medium">{title}</span>
                          <button
                              className="text-sm text-red-400 hover:text-red-300"
                              title="찜 해제"
                          >
                            ✕
                          </button>
                        </div>
                    ))}
                  </div>
              )}
            </section>

            {/* 감상 기록 섹션 */}
            <section className="bg-[#1E1E1E] p-6 rounded-lg space-y-3">
              <h2 className="text-xl font-semibold border-b border-gray-600 pb-2">🎬 감상 기록</h2>
              {watched.length === 0 ? (
                  <p className="text-gray-400 text-sm">아직 감상한 영화가 없습니다.</p>
              ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                    {watched.map((title, idx) => (
                        <div
                            key={idx}
                            className="bg-[#2A2A2A] p-4 rounded-lg flex items-center justify-between hover:bg-[#2f2f2f] transition"
                        >
                          <span className="text-white font-medium">{title}</span>
                          <button
                              className="text-sm text-gray-400 hover:text-gray-200"
                              title="리뷰 보기"
                          >
                            리뷰
                          </button>
                        </div>
                    ))}
                  </div>
              )}
            </section>
          </div>
        </div>
      </Layout>
  );
};

export default Mypage;