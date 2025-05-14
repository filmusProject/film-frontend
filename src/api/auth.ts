import axiosInstance from '../utils/axiosInstance';
import { AxiosResponse } from 'axios';

// 유저 정보 타입
export interface User {
    id: number;
    email: string;
    nickname: string;
    role: string;
}
/* ---------------- 로그인 ---------------- */
export const login = async (form: {
    email: string;
    password: string;
}): Promise<User> => {
    const res = await axiosInstance.post<User>("/auth/login", form);

    /* ── accessToken 헤더 추출 & 저장 ── */
    const authHeader =
        (res.headers as any)["authorization"] ||
        (res.headers as any)["Authorization"];
    if (authHeader) {
        /* “Bearer xxx” → “xxx” */
        const [, token] = authHeader.split(" ");
        localStorage.setItem("accessToken", token);
    }

    return res.data; // → User 객체
};

/* ---------------- 로그아웃 ---------------- */
export const logout = async () => {
    await axiosInstance.post("/auth/logout");
    /* refreshToken 은 HttpOnly 쿠키이므로 JS 에서 지울 수 없고,
       서버가 Set‑Cookie Max‑Age=0 으로 지웁니다. */
    localStorage.removeItem("accessToken");
};