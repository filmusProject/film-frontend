import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import axios from '../utils/axiosInstance'; // ✅ baseURL, interceptors 등 설정된 axios 인스턴스

const ChangePasswordPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (form.newPassword !== form.confirmPassword) {
      alert('새 비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      // 서버에 PUT 요청
      await axios.put('/user/change-password', {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword
      });
      // 성공 시
      setSuccess(true);
      // 혹시 다른 페이지로 이동할 경우
      // navigate('/mypage');
    } catch (err) {
      // 에러 시
      console.error('비밀번호 변경 실패:', err);
      setError(err.response?.data?.message || '비밀번호 변경 중 오류가 발생했습니다.');
    }
  };

  return (
      <Layout>
        <div className="min-h-screen bg-[#121212] text-white font-sans px-6 py-20">
          <div className="max-w-md mx-auto space-y-6">
            <h1 className="text-2xl font-bold mb-4">🔐 비밀번호 변경</h1>
            <form onSubmit={handleSubmit} className="bg-[#1E1E1E] p-6 rounded-lg space-y-4">
              <div>
                <label className="block mb-1">현재 비밀번호</label>
                <input
                    type="password"
                    name="currentPassword"
                    value={form.currentPassword}
                    onChange={handleChange}
                    required
                    className="w-full bg-[#2A2A2A] text-white px-4 py-2 rounded-lg"
                />
              </div>
              <div>
                <label className="block mb-1">새 비밀번호</label>
                <input
                    type="password"
                    name="newPassword"
                    value={form.newPassword}
                    onChange={handleChange}
                    required
                    className="w-full bg-[#2A2A2A] text-white px-4 py-2 rounded-lg"
                />
              </div>
              <div>
                <label className="block mb-1">새 비밀번호 확인</label>
                <input
                    type="password"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full bg-[#2A2A2A] text-white px-4 py-2 rounded-lg"
                />
              </div>

              {/* 에러 메시지 */}
              {error && (
                  <p className="text-red-400 text-sm">{error}</p>
              )}

              <button type="submit" className="w-full bg-custom text-white py-2 rounded-button">
                비밀번호 변경
              </button>
            </form>

            {/* 성공 메시지 */}
            {success && (
                <p className="text-green-400 text-sm text-center">비밀번호가 성공적으로 변경되었습니다!</p>
            )}
          </div>
        </div>
      </Layout>
  );
};

export default ChangePasswordPage;