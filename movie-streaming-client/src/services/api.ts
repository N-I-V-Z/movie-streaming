import axios from 'axios';
import { ApiResponse, Movie, PagedResult } from '@/types';

const BASE_URL = 'http://localhost:5041/api'; // Hãy khớp cổng port của backend bạn đang chạy

const api = axios.create({
    baseURL: BASE_URL,
});

export const movieService = {
    getAll: async (page: number = 1, pageSize: number = 8) => {
        const response = await api.get<ApiResponse<PagedResult<Movie>>>(`/movies?pageNumber=${page}&pageSize=${pageSize}`);
        return response.data;
    },

    getById: async (id: number) => {
        const response = await api.get<ApiResponse<Movie>>(`/movies/${id}`);
        return response.data;
    },

    upload: async (file: File, title: string, description: string) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', title);
        formData.append('description', description);

        const response = await api.post<ApiResponse<Movie>>('/movies/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    }
};

export default api;
