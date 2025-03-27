import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout'; // 경로는 src/pages에서 시작한다고 가정

const LoginPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("로그인 성공 (시뮬레이션)");
    navigate('/mypage');
  };

  return (
    <Layout>  {/* Layout 적용 시작 */}
    <div className="min-h-screen bg-[#121212] text-white font-sans px-6 py-20">
      <div className="max-w-md mx-auto space-y-6">
        <h1 className="text-2xl font-bold mb-4">🔐 로그인</h1>
        <form onSubmit={handleSubmit} className="bg-[#1E1E1E] p-6 rounded-lg space-y-4">
          <div>
            <label className="block mb-1">아이디</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              required
              className="w-full bg-[#2A2A2A] text-white px-4 py-2 rounded-lg"
            />
          </div>
          <div>
            <label className="block mb-1">비밀번호</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full bg-[#2A2A2A] text-white px-4 py-2 rounded-lg"
            />
          </div>
          <button type="submit" className="w-full bg-custom text-white py-2 rounded-button">로그인</button>
        </form>
        <div className="flex justify-between text-sm text-gray-400">
          <a href="/signup" className="hover:underline">회원가입</a>
          <a href="/find-username" className="hover:underline">아이디 찾기</a>
          <a href="/reset-password" className="hover:underline">비밀번호 재설정</a>
        </div>
      </div>
    </div>
    </Layout>
  );
};

export default LoginPage;