import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout'; // 경로는 src/pages에서 시작한다고 가정

const Mypage = () => {
  const userInfo = {
    username: 'taco123',
    email: 'taco@example.com',
    nickname: '타코'
  };

  const bookmarked = ['괴물', '기생충', '옥자'];
  const watched = ['인셉션', '인터스텔라', '어바웃타임'];

  return (
    <Layout>  {/* Layout 적용 시작 */}
    <div className="min-h-screen bg-[#121212] text-white font-sans px-6 py-20">
      <div className="max-w-4xl mx-auto space-y-10">
        <h1 className="text-2xl font-bold">👤 마이페이지</h1>

        <section className="bg-[#1E1E1E] p-6 rounded-lg space-y-2">
          <h2 className="text-xl font-semibold mb-2">회원 정보</h2>
          <p><strong>아이디:</strong> {userInfo.username}</p>
          <p><strong>이메일:</strong> {userInfo.email}</p>
          <p><strong>닉네임:</strong> {userInfo.nickname}</p>
          <Link to="/change-password" className="text-sm text-custom hover:underline">비밀번호 변경</Link>
        </section>

        <section className="bg-[#1E1E1E] p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">⭐ 찜한 영화</h2>
          <ul className="list-disc list-inside text-gray-300">
            {bookmarked.map((title, i) => <li key={i}>{title}</li>)}
          </ul>
        </section>

        <section className="bg-[#1E1E1E] p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">🎬 감상 기록</h2>
          <ul className="list-disc list-inside text-gray-300">
            {watched.map((title, i) => <li key={i}>{title}</li>)}
          </ul>
        </section>
      </div>
    </div>
    </Layout>
  );
};

export default Mypage;