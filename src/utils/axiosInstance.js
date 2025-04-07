import axios from 'axios';

const instance = axios.create({
    baseURL: '/api', // proxy: "https://localhost:8443"가 처리
    withCredentials: true, // 쿠키/세션 전송 위해 필요
});

instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken'); // "Bearer eyJ..." 형태

        if (token) {
            // 이미 "Bearer "로 시작한다면 그대로 사용
            if (token.startsWith('Bearer ')) {
                config.headers.Authorization = token;
            } else {
                // 그렇지 않다면 "Bearer " prefix 붙이기
                config.headers.Authorization = `Bearer ${token}`;
            }
        }

        return config;
    },
    (error) => Promise.reject(error)
);


instance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                // refresh
                const refresh = await axios.post('/api/token/refresh', null, { withCredentials: true });
                const newAccessToken = refresh.data.accessToken;
                localStorage.setItem('accessToken', newAccessToken);
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return instance(originalRequest);
            } catch (err) {
                console.error('토큰 재발급 실패:', err);
            }
        }
        return Promise.reject(error);
    }
);

export default instance;