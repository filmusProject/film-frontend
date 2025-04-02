import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import axios from 'axios';
import { Link } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // 에러 초기화

    try {
      const response = await axios.post('/api/auth/login', form, {
        withCredentials: true // ✅ Refresh Token (HttpOnly Cookie) 받기 위해 필요
      });

      const accessToken = response.data.accessToken || response.headers['authorization'];
      if (accessToken) {
        localStorage.setItem('accessToken', accessToken); // ✅ Access Token 저장
        alert("로그인 성공!");
        navigate('/mypage');
      } else {
        setError('서버에서 토큰을 전달하지 않았습니다.');
      }
    } catch (err) {
      if (err.response?.status === 401) {
        setError('아이디 또는 비밀번호가 올바르지 않습니다.');
      } else {
        setError('로그인 중 문제가 발생했습니다.');
      }
    }
  };

  return (
    <Layout>
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
            {error && <div className="text-red-400 text-sm">{error}</div>}
            <button type="submit" className="w-full bg-custom text-white py-2 rounded-button">로그인</button>
          </form>
          <div className="flex justify-between text-sm text-gray-400">
            <Link to="/signup" className="hover:underline">회원가입</Link>
            <Link to="/find-username" className="hover:underline">아이디 찾기</Link>
            <Link to="/reset-password" className="hover:underline">비밀번호 재설정</Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage;