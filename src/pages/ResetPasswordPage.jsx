import React, { useState } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';

const ResetPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(false);
    setError('');

    try {
      await axios.post('/api/auth/reset-password', null, {
        params: { email }
      });

      setSubmitted(true);
    } catch (err) {
      if (err.response?.status === 404) {
        setError('해당 이메일로 가입된 계정을 찾을 수 없습니다.');
      } else {
        setError('요청 처리 중 문제가 발생했습니다.');
      }
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-[#121212] text-white font-sans px-6 py-20">
        <div className="max-w-md mx-auto space-y-6">
          <h1 className="text-2xl font-bold mb-4">🔐 비밀번호 재설정</h1>
          <form onSubmit={handleSubmit} className="bg-[#1E1E1E] p-6 rounded-lg space-y-4">
            <label className="block mb-1">가입한 이메일 주소</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-[#2A2A2A] text-white px-4 py-2 rounded-lg"
            />
            <button type="submit" className="w-full bg-custom text-white py-2 rounded-button">임시 비밀번호 요청</button>
          </form>
          {submitted && (
            <p className="text-green-400 text-sm text-center mt-2">
              이메일로 임시 비밀번호가 전송되었습니다!
            </p>
          )}
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
        </div>
      </div>
    </Layout>
  );
};

export default ResetPasswordPage;