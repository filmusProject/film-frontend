import React, { useState } from 'react';
import Layout from '../components/Layout';
import axios from '../utils/axiosInstance';

const SignupPage = () => {
  // 입력 폼 상태 관리
  const [form, setForm] = useState({
    username: '',
    password: '',
    email: '',
    nickname: '',
    gender: '',
    birthDate: ''
  });

  // input 요소 값 변경 핸들러
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 회원가입 제출 처리
  const handleSubmit = async (e) => {
    e.preventDefault(); // 기본 제출 동작 막기
    console.log('[📬 회원가입 요청 시작]', form);

    try {
      const response = await axios.post('/auth/signup', form); // POST 요청
      console.log('[✅ 회원가입 성공]', response.data);
      alert('회원가입이 완료되었습니다! 이메일 인증을 진행해주세요.');
    } catch (error) {
      console.error('[❌ 회원가입 실패]', error);
      const message = error.response?.data?.message || '서버 오류가 발생했습니다.';
      alert(`회원가입 실패: ${message}`);
    }
  };

  return (
      <Layout>
        <div className="min-h-screen bg-[#121212] text-white font-sans px-6 py-20">
          <div className="max-w-md mx-auto space-y-6">
            <h1 className="text-2xl font-bold mb-4">📬 회원가입</h1>

            {/* 반드시 form에 onSubmit 연결되어 있어야 함 */}
            <form onSubmit={handleSubmit} className="bg-[#1E1E1E] p-6 rounded-lg space-y-4">
              <div>
                <label className="block mb-1">아이디</label>
                <input
                    type="text" name="username" value={form.username}
                    onChange={handleChange} required
                    autoComplete="username"
                    className="w-full bg-[#2A2A2A] text-white px-4 py-2 rounded-lg"
                />
              </div>
              <div>
                <label className="block mb-1">이메일</label>
                <input
                    type="email" name="email" value={form.email}
                    onChange={handleChange} required
                    autoComplete="email"
                    className="w-full bg-[#2A2A2A] text-white px-4 py-2 rounded-lg"
                />
              </div>
              <div>
                <label className="block mb-1">닉네임</label>
                <input
                    type="text" name="nickname" value={form.nickname}
                    onChange={handleChange} required
                    className="w-full bg-[#2A2A2A] text-white px-4 py-2 rounded-lg"
                />
              </div>
              <div>
                <label className="block mb-1">비밀번호</label>
                <input
                    type="password" name="password" value={form.password}
                    onChange={handleChange} required
                    autoComplete="new-password"
                    className="w-full bg-[#2A2A2A] text-white px-4 py-2 rounded-lg"
                />
              </div>
              <div>
                <label className="block mb-1">성별</label>
                <select
                    name="gender" value={form.gender}
                    onChange={handleChange} required
                    className="w-full bg-[#2A2A2A] text-white px-4 py-2 rounded-lg"
                >
                  <option value="">성별을 선택하세요</option>
                  <option value="MALE">남성</option>
                  <option value="FEMALE">여성</option>
                  <option value="OTHER">기타</option>
                </select>
              </div>
              <div>
                <label className="block mb-1">생년월일</label>
                <input
                    type="date" name="birthDate" value={form.birthDate}
                    onChange={handleChange} required
                    className="w-full bg-[#2A2A2A] text-white px-4 py-2 rounded-lg"
                />
              </div>

              {/* 반드시 type="submit" 명시 */}
              <button type="submit" className="w-full bg-custom text-white py-2 rounded-button">
                회원가입
              </button>
            </form>

            <p className="text-sm text-gray-400 text-center">가입 시 이메일 인증이 전송됩니다.</p>
          </div>
        </div>
      </Layout>
  );
};

export default SignupPage;