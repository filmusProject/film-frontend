import React, { useState } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';

const SignupPage = () => {
  const [form, setForm] = useState({
    username: '',
    password: '',
    email: '',
    nickname: '',
    gender: '',
    birthDate: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('/api/auth/signup', form)
      .then(response => {
        alert("회원가입이 완료되었습니다! 이메일 인증을 진행해주세요.");
      })
      .catch(error => {
        const message = error.response?.data?.message || '서버 오류가 발생했습니다.';
        alert(`회원가입 실패: ${message}`);
      });
  };

  return (
    <Layout>
      <div className="min-h-screen bg-[#121212] text-white font-sans px-6 py-20">
        <div className="max-w-md mx-auto space-y-6">
          <h1 className="text-2xl font-bold mb-4">📬 회원가입</h1>
          <form onSubmit={handleSubmit} className="bg-[#1E1E1E] p-6 rounded-lg space-y-4">
            <div>
              <label className="block mb-1">아이디</label>
              <input
                type="text" name="username" value={form.username}
                onChange={handleChange} required
                className="w-full bg-[#2A2A2A] text-white px-4 py-2 rounded-lg" />
            </div>
            <div>
              <label className="block mb-1">이메일</label>
              <input
                type="email" name="email" value={form.email}
                onChange={handleChange} required
                className="w-full bg-[#2A2A2A] text-white px-4 py-2 rounded-lg" />
            </div>
            <div>
              <label className="block mb-1">닉네임</label>
              <input
                type="text" name="nickname" value={form.nickname}
                onChange={handleChange} required
                className="w-full bg-[#2A2A2A] text-white px-4 py-2 rounded-lg" />
            </div>
            <div>
              <label className="block mb-1">비밀번호</label>
              <input
                type="password" name="password" value={form.password}
                onChange={handleChange} required
                className="w-full bg-[#2A2A2A] text-white px-4 py-2 rounded-lg" />
            </div>
            <div>
              <label className="block mb-1">성별</label>
              <select
                name="gender" value={form.gender}
                onChange={handleChange} required
                className="w-full bg-[#2A2A2A] text-white px-4 py-2 rounded-lg">
                <option value="">성별을 선택하세요</option>
                <option value="male">남성</option>
                <option value="female">여성</option>
                <option value="other">기타</option>
              </select>
            </div>
            <div>
              <label className="block mb-1">생년월일</label>
              <input
                type="date" name="birthDate" value={form.birthDate}
                onChange={handleChange} required
                className="w-full bg-[#2A2A2A] text-white px-4 py-2 rounded-lg" />
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