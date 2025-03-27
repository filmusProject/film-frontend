import React, { useState } from 'react';
import Layout from '../components/Layout'; // 경로는 src/pages에서 시작한다고 가정

const ChangePasswordPage = () => {
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      alert('새 비밀번호가 일치하지 않습니다.');
    } else {
      setSuccess(true);
    }
  };

  return (
    <Layout>  {/* Layout 적용 시작 */}
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
          <button type="submit" className="w-full bg-custom text-white py-2 rounded-button">비밀번호 변경</button>
        </form>
        {success && (
          <p className="text-green-400 text-sm text-center">비밀번호가 성공적으로 변경되었습니다!</p>
        )}
      </div>
    </div>
    </Layout>
  );
};

export default ChangePasswordPage;