import React, { useState } from 'react';
import Layout from '../components/Layout'; // 경로는 src/pages에서 시작한다고 가정

const FindUsernamePage = () => {
  const [email, setEmail] = useState('');
  const [result, setResult] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setResult(`해당 이메일로 등록된 아이디는: taco123 입니다`);
  };

  return (
    <Layout>  {/* Layout 적용 시작 */}
    <div className="min-h-screen bg-[#121212] text-white font-sans px-6 py-20">
      <div className="max-w-md mx-auto space-y-6">
        <h1 className="text-2xl font-bold mb-4">🔎 아이디 찾기</h1>
        <form onSubmit={handleSubmit} className="bg-[#1E1E1E] p-6 rounded-lg space-y-4">
          <label className="block mb-1">이메일 주소</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-[#2A2A2A] text-white px-4 py-2 rounded-lg"
          />
          <button type="submit" className="w-full bg-custom text-white py-2 rounded-button">아이디 찾기</button>
        </form>
        {result && <p className="text-green-400 text-sm text-center">{result}</p>}
      </div>
    </div>
    </Layout>
  );
};

export default FindUsernamePage;