import axios from "axios";
import AuthService from "./services/authService";
import {RefreshRequest} from "./models/request/refreshRequest";


const api = axios.create({
    baseURL: "/",
    withCredentials: true, // Для работы с httpOnly cookies (если сервер использует)
});

// Функция для обновления `accessToken`
const refreshToken = async () => {
    try {
        const storedRefreshToken = localStorage.getItem("refreshToken");

        if (!storedRefreshToken) {
            throw new Error("Отсутствует refreshToken");
        }

        const request: RefreshRequest = { refreshToken: storedRefreshToken };
        const response = await AuthService.refresh(request);

        localStorage.setItem("accessToken", response.data.accessToken);
        return response.data.accessToken;
    } catch (error) {
        console.error("Не удалось обновить токен:", error);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login"; // Перенаправление на страницу логина
        throw error;
    }
};

// Интерцептор запросов (добавляет `accessToken`)
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Интерцептор ответов (перехватывает 401 и обновляет токен)
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        const isLoginRequest = originalRequest.url?.includes("/auth/login");
        const isRefreshRequest = originalRequest.url?.includes("/auth/refreshToken");

        // Если 401, НЕ логин и НЕ refresh, то пробуем обновить токен
        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !isLoginRequest &&
            !isRefreshRequest
        ) {
            originalRequest._retry = true;
            try {
                const newAccessToken = await refreshToken();
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                console.error("Ошибка обновления токена:", refreshError);
            }
        }

        // В остальных случаях — просто пробросить ошибку
        return Promise.reject(error);
    }
);

export default api;