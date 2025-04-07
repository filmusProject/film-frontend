import React, { useState } from 'react';
import Layout from '../components/Layout';
import axios from '../utils/axiosInstance';

const FindUsernamePage = () => {
  const [email, setEmail] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult('');
    setError('');

    try {
      const response = await axios.post('/auth/find-username', { email });

      setResult(`해당 이메일로 등록된 아이디는: ${response.data.username}`);
      setEmail(''); // ✅ 이메일 입력 필드 초기화
    } catch (err) {
      if (err.response?.status === 404) {
        setError('등록된 이메일을 찾을 수 없습니다.');
      } else {
        setError('요청 중 오류가 발생했습니다.');
      }
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-[#121212] text-white font-sans px-6 py-20">
        <div className="max-w-md mx-auto space-y-6">
          <h1 className="text-2xl font-bold mb-4">🔎 아이디 찾기</h1>
          <form onSubmit={handleSubmit} className="bg-[#1E1E1E] p-6 rounded-lg space-y-4">
            <label className="block mb-1">
              이메일 주소
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#2A2A2A] text-white px-4 py-2 rounded-lg"
              />
            </label>
            <button type="submit" className="w-full bg-custom text-white py-2 rounded-button">아이디 찾기</button>
          </form>
          {result && <p className="text-green-400 text-sm text-center">{result}</p>}
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
        </div>
      </div>
    </Layout>
  );
};

export default FindUsernamePage;