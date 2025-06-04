/* -------------------------------------------
   src/pages/ChangePasswordPage.tsx (with z-index fix)
   ------------------------------------------- */
import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import axios from '../utils/axiosInstance';

const ChangePasswordPage: React.FC = () => {
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  /* --------------- 인풋 변경 --------------- */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  /* --------------- 제출 --------------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setDone(false);

    if (form.newPassword !== form.confirmPassword)
      return setError('새 비밀번호가 서로 다릅니다.');
    if (form.newPassword.length < 8)
      return setError('새 비밀번호는 8자 이상이어야 합니다.');

    try {
      setLoading(true);
      await axios.put('/api/user/change-password', {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      setDone(true);
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      setError(
          err.response?.data?.message || '비밀번호 변경 중 오류가 발생했습니다.',
      );
    } finally {
      setLoading(false);
    }
  };

  /* --------------- UI --------------- */
  return (
      <Layout>
        {/* fixed + z-[9999] 로 입력 블로킹 방지 */}
        <div className="fixed inset-0 z-[9999] min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
          <div className="w-full max-w-md z-[9999] backdrop-blur-xl backdrop-saturate-150 bg-white/70 dark:bg-gray-800/50 border border-white/20 rounded-xl shadow-lg p-8 font-['Poppins']">
            <header className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">비밀번호 변경</h1>
            </header>

            <form onSubmit={handleSubmit} className={`space-y-6 ${error && 'animate-shake'}`}>
              <InputBox
                  id="currentPassword"
                  label="현재 비밀번호"
                  name="currentPassword"
                  type="password"
                  value={form.currentPassword}
                  onChange={handleChange}
              />
              <InputBox
                  id="newPassword"
                  label="새 비밀번호 (8자 이상)"
                  name="newPassword"
                  type="password"
                  value={form.newPassword}
                  onChange={handleChange}
              />
              <InputBox
                  id="confirmPassword"
                  label="새 비밀번호 확인"
                  name="confirmPassword"
                  type="password"
                  value={form.confirmPassword}
                  onChange={handleChange}
              />

              {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

              <button type="submit" disabled={loading} className="w-full bg-[#FF574F] hover:bg-[#e64940] text-white font-medium py-3 rounded-lg transition active:scale-95">
                {loading ? <span className="animate-pulse">변경 중…</span> : '비밀번호 변경'}
              </button>
            </form>

            {done && (
                <p className="text-green-500 text-sm font-medium text-center mt-4">✅ 비밀번호가 성공적으로 변경되었습니다!</p>
            )}
          </div>
        </div>
      </Layout>
  );
};

/* ---------- 소형 입력 컴포넌트 ---------- */
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
}
const InputBox: React.FC<InputProps> = ({ id, label, ...rest }) => (
    <div>
      <label htmlFor={id} className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <input
          id={id}
          {...rest}
          className="w-full px-4 py-3 rounded-lg border-none focus:ring-2 focus:ring-[#FF574F] bg-white/50 dark:bg-gray-700/50 text-sm"
      />
    </div>
);

export default ChangePasswordPage;
