/* -------------------------------------------
   src/contexts/AuthContext.tsx
------------------------------------------- */
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import * as authAPI from "../api/auth";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { User } from "../api/auth";

interface AuthContextType {
  user: User | null;
  login: (form: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  /* --- 앱 최초 로드 : accessToken 가 있으면 /user/me 로 프로필 조회 --- */
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setLoading(false);
      return;
    }

    axiosInstance
        .get<User>("/user/me")
        .then(({ data }) => setUser(data))
        .catch(() => {
          localStorage.removeItem("accessToken");
          setUser(null);
        })
        .finally(() => setLoading(false));
  }, []);

  /* ---------------- 로그인 ---------------- */
  const login = async (form: { email: string; password: string }) => {
    const loggedInUser = await authAPI.login(form); // accessToken 저장은 authAPI.login 안에서
    setUser(loggedInUser);
  };

  /* ---------------- 로그아웃 ---------------- */
  const logout = async () => {
    await authAPI.logout();
    setUser(null);
    navigate("/");
  };

  return (
      <AuthContext.Provider
          value={{ user, login, logout, isAuthenticated: !!user }}
      >
        {!loading && children}
      </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};