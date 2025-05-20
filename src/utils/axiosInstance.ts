import axios, {
    AxiosResponse,
    AxiosError,
    InternalAxiosRequestConfig,
} from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://api.filmus.o-r.kr/api',
    //baseURL: 'https://localhost:8443/api',
    withCredentials: true,
});

/* 요청 인터셉터 – accessToken 자동 첨부 */
axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            // Axios v1 헤더 객체는 AxiosHeaders 타입
            if (typeof config.headers.set === 'function') {
                config.headers.set('Authorization', `Bearer ${token}`);
            } else {
                // fallback (타입 단언)
                (config.headers as any).Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error: AxiosError) => Promise.reject(error),
);

/* 응답 인터셉터 – 401 처리 */
axiosInstance.interceptors.response.use(
    (response: AxiosResponse): AxiosResponse => response,
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('accessToken');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    },
);

export default axiosInstance;