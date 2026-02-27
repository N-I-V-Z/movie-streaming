import axios from 'axios';
import { ApiResponse, Movie, PagedResult } from '@/types';

const getBaseUrl = () => {
    // Ưu tiên biến môi trường, đảm bảo không bị thừa/thiếu dấu slash
    const url = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || 'http://localhost:5041';
    return `${url}/api`;
};

/**
 * Cấu hình Axios instance dùng chung cho toàn bộ dự án
 */
export const api = axios.create({
    baseURL: getBaseUrl(),
    timeout: 10000, // 10 giây timeout để tránh treo app
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Request Interceptor: Quản lý Token và Logs
api.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        console.error('[API Request Error]', error);
        return Promise.reject(error);
    }
);

// Response Interceptor: Xử lý lỗi tập trung
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const { response } = error;
        
        if (response) {
            // Xử lý các mã lỗi HTTP phổ biến
            switch (response.status) {
                case 401:
                    console.error('Hết hạn phiên làm việc - Redirecting to login...');
                    break;
                case 403:
                    console.error('Bạn không có quyền truy cập tài nguyên này');
                    break;
                case 500:
                    console.error('Lỗi hệ thống (Server Error)');
                    break;
                default:
                    console.error(`Lỗi API: ${response.status}`, response.data);
            }
        } else if (error.code === 'ECONNABORTED') {
            console.error('Lỗi kết nối: Timeout');
        } else {
            console.error('Lỗi kết nối: Mạng không ổn định hoặc Server không phản hồi');
        }

        return Promise.reject(error);
    }
);

export default api;
