/* -------------------------------------------
   src/pages/SignupPage.tsx
   ------------------------------------------- */
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout       from "../components/layout/Layout";
import { useTheme } from "../contexts/ThemeContext";
import axios        from "../utils/axiosInstance";

/* ---------------- 타입 ---------------- */
interface FormState {
  username: string;
  email: string;
  nickname: string;
  password: string;
  confirm: string;
  gender: "" | "MALE" | "FEMALE" | "OTHER";
  birthDate: string;
}
interface ErrState {
  username?: string;
  email?: string;
  nickname?: string;
  password?: string;
  confirm?: string;
  general?: string;
}

/* -------------- 컴포넌트 -------------- */
const SignupPage: React.FC = () => {
  const [form, setForm]   = useState<FormState>({
    username: "",
    email: "",
    nickname: "",
    password: "",
    confirm: "",
    gender: "",
    birthDate: "",
  });
  const [errs, setErrs]   = useState<ErrState>({});
  const [loading, setLoad] = useState(false);
  const { theme }         = useTheme();
  const navigate          = useNavigate();

  /* ----- 입력 공통 처리 ----- */
  const update = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm({ ...form, [e.target.name]: e.target.value });

  /* ----- 유틸 ----- */
  const validEmail = (v: string) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const pwStrength = (v: string) => {
    if (!v) return 0;
    let s = 0;
    if (v.length >= 8) s += 1;
    if (/\d/.test(v)) s += 1;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(v)) s += 1;
    if (/[A-Z]/.test(v)) s += 1;
    return s; // 0~4
  };

  /* ----- 제출 ----- */
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const eMap: ErrState = {};

    if (!form.username.trim())  eMap.username = "아이디를 입력하세요.";
    if (!form.email.trim())     eMap.email    = "이메일을 입력하세요.";
    else if (!validEmail(form.email)) eMap.email = "올바른 이메일 형식이 아닙니다.";
    if (!form.nickname.trim())  eMap.nickname = "닉네임을 입력하세요.";
    if (!form.password)         eMap.password = "비밀번호를 입력하세요.";
    else if (form.password.length < 8) eMap.password = "8자 이상 입력하세요.";
    if (!form.confirm)          eMap.confirm  = "비밀번호 확인이 필요합니다.";
    else if (form.password !== form.confirm) eMap.confirm = "비밀번호가 일치하지 않습니다.";

    setErrs(eMap);
    if (Object.keys(eMap).length) return;

    /* ---- API 호출 ---- */
    try {
      setLoad(true);
      await axios.post("/auth/signup", {
        username:  form.username,
        password:  form.password,
        email:     form.email,
        nickname:  form.nickname,
        gender:    form.gender,
        birthDate: form.birthDate,
      });
      alert("회원가입이 완료되었습니다! 이메일 인증을 진행해주세요.");
      navigate("/login");
    } catch (err: any) {
      const msg = err.response?.data?.message || "서버 오류가 발생했습니다.";
      setErrs({ general: msg });
    } finally {
      setLoad(false);
    }
  };

  /* ---------- UI ---------- */
  return (
      <Layout>
        {/* 배경 & 중앙정렬 */}
        <div
            className={`
          fixed inset-0 flex items-center justify-center
          ${theme === "dark"
                ? "bg-gradient-to-br from-gray-900 to-gray-800"
                : "bg-gradient-to-br from-gray-50 to-gray-100"}
        `}
        >
          {/* 카드 */}
          <div
              className={`
            w-[min(92vw,32rem)] sm:w-[28rem]
            backdrop-blur-xl backdrop-saturate-150
            bg-white/70 dark:bg-gray-800/50
            border border-white/20 shadow-lg rounded-xl p-8
          `}
          >
            <header className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                Filmus
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                새 계정을 만들어보세요
              </p>
            </header>

            {/* ---------- 폼 ---------- */}
            <form
                onSubmit={onSubmit}
                className={`space-y-5 ${Object.keys(errs).length && "animate-shake"}`}
            >
              {/* 아이디 */}
              <Input
                  label="아이디"
                  name="username"
                  value={form.username}
                  onChange={update}
                  error={!!errs.username}
                  helper={errs.username}
                  theme={theme}
              />
              {/* 이메일 */}
              <Input
                  label="이메일"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={update}
                  error={!!errs.email}
                  helper={errs.email}
                  theme={theme}
              />
              {/* 닉네임 */}
              <Input
                  label="닉네임"
                  name="nickname"
                  value={form.nickname}
                  onChange={update}
                  error={!!errs.nickname}
                  helper={errs.nickname}
                  theme={theme}
              />
              {/* 비밀번호 */}
              <Input
                  label="비밀번호"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={update}
                  error={!!errs.password}
                  helper={errs.password}
                  theme={theme}
              >
                {/* 강도 표시 */}
                {form.password && (
                    <PwMeter strength={pwStrength(form.password)} />
                )}
              </Input>
              {/* 비밀번호 확인 */}
              <Input
                  label="비밀번호 확인"
                  name="confirm"
                  type="password"
                  value={form.confirm}
                  onChange={update}
                  error={!!errs.confirm}
                  helper={errs.confirm}
                  theme={theme}
              >
                {form.password && form.confirm && (
                    <p
                        className={`mt-1 text-sm flex items-center ${
                            form.password === form.confirm
                                ? "text-green-500"
                                : "text-red-500"
                        }`}
                    >
                      <i
                          className={`fas ${
                              form.password === form.confirm ? "fa-check-circle" : "fa-times-circle"
                          } mr-1`}
                      />
                      {form.password === form.confirm
                          ? "비밀번호가 일치합니다."
                          : "비밀번호가 일치하지 않습니다."}
                    </p>
                )}
              </Input>

              {/* 성별 & 생년월일 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                    성별
                  </label>
                  <select
                      name="gender"
                      value={form.gender}
                      onChange={update}
                      required
                      className={`w-full px-4 py-3 rounded-lg border-none focus:ring-2 focus:ring-[#FF574F]
                    ${theme === "dark" ? "bg-gray-700/50 text-white" : "bg-white/50 text-black"}
                    text-sm`}
                  >
                    <option value="">선택하세요</option>
                    <option value="MALE">남성</option>
                    <option value="FEMALE">여성</option>
                    <option value="OTHER">기타</option>
                  </select>
                </div>
                <Input
                    label="생년월일"
                    name="birthDate"
                    type="date"
                    value={form.birthDate}
                    onChange={update}
                    theme={theme}
                />
              </div>

              {/* 서버 오류 */}
              {errs.general && (
                  <p className="text-red-500 text-sm font-medium">{errs.general}</p>
              )}

              {/* 제출 버튼 */}
              <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#FF574F] hover:bg-[#e64940] text-white font-medium py-3 rounded-lg transition active:scale-95"
              >
                {loading ? "가입 처리 중…" : "회원가입"}
              </button>
            </form>

            {/* 로그인으로 이동 */}
            <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
              이미 계정이 있나요?{" "}
              <Link to="/login" className="text-[#FF574F] hover:underline">
                로그인
              </Link>
            </p>
          </div>
        </div>
      </Layout>
  );
};

/* -------- 입력 공통 컴포넌트 -------- */
interface InProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  error?: boolean;
  helper?: string;
  theme: "light" | "dark";
  children?: React.ReactNode;
}
const Input: React.FC<InProps> = ({
                                    label,
                                    error,
                                    helper,
                                    theme,
                                    children,
                                    ...rest
                                  }) => (
    <div>
      <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <input
          {...rest}
          className={`
        w-full px-4 py-3 rounded-lg border-none focus:ring-2 focus:ring-[#FF574F]
        ${theme === "dark" ? "bg-gray-700/50 text-white" : "bg-white/50 text-black"}
        text-sm ${error && "ring-2 ring-red-500"}
      `}
      />
      {helper && <p className="mt-1 text-sm text-red-500">{helper}</p>}
      {children}
    </div>
);

/* -------- 비밀번호 강도 막대 -------- */
const PwMeter: React.FC<{ strength: number }> = ({ strength }) => {
  const bar = ["bg-gray-200", "bg-red-500", "bg-yellow-500", "bg-blue-500", "bg-green-500"][strength];
  const label = ["매우 약함", "약함", "보통", "강함", "아주 강함"][strength];
  return (
      <div className="mt-2">
        <div className="flex items-center space-x-2 mb-1">
          <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div className={`h-full ${bar}`} style={{ width: `${strength * 25}%` }} />
          </div>
          <span className="text-xs text-gray-500">{label}</span>
        </div>
        <p className="text-xs text-gray-500">8자 이상, 숫자/특수문자/대문자 포함 시 보안 ↑</p>
      </div>
  );
};

export default SignupPage;