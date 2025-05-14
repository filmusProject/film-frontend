// ✅ 로그인 / 로그아웃 기능을 담당하는 auth 서비스
import axios from '../utils/axiosInstance';

interface LoginParams {
  username: string;
  password: string;
}

interface LoginResponse {
  accessToken?: string;
}

export const login = async ({ username, password }: LoginParams): Promise<LoginResponse> => {
  const response = await axios.post<LoginResponse>('/auth/login', { username, password });

  // access token을 응답 헤더 또는 body에서 받음
  const accessToken: string | undefined =
    response.data.accessToken || response.headers['authorization'];

  if (accessToken) {
    localStorage.setItem('accessToken', accessToken);
  }

  return response.data;
};

export const logout = async (): Promise<void> => {
  await axios.post('/auth/logout');
  localStorage.removeItem('accessToken');
};