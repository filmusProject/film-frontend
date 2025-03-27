import React, { useState } from 'react';
import Layout from '../components/Layout'; // 경로는 src/pages에서 시작한다고 가정

const SignupPage = () => {
  const [form, setForm] = useState({
    username: '',
    password: '',
    email: '',
    nickname: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("회원가입 요청이 전송되었습니다 (시뮬레이션)");
  };

  return (
    <Layout>  {/* Layout 적용 시작 */}
    <div className="min-h-screen bg-[#121212] text-white font-sans px-6 py-20">
      <div className="max-w-md mx-auto space-y-6">
        <h1 className="text-2xl font-bold mb-4">📬 회원가입</h1>
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
            <label className="block mb-1">이메일</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full bg-[#2A2A2A] text-white px-4 py-2 rounded-lg"
            />
          </div>
          <div>
            <label className="block mb-1">닉네임</label>
            <input
              type="text"
              name="nickname"
              value={form.nickname}
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
          <button type="submit" className="w-full bg-custom text-white py-2 rounded-button">회원가입</button>
        </form>
        <p className="text-sm text-gray-400 text-center">가입 시 이메일 인증이 전송됩니다.</p>
      </div>
    </div>
    </Layout>
  );
};

export default SignupPage;