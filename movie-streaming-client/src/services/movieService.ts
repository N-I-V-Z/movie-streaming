import api from './api';
import { ApiResponse, Movie, PagedResult } from '@/types';

const PREFIX = '/movies';

export const movieService = {
    getAll: async (search: string = '', page: number = 1, pageSize: number = 10) => {
        const response = await api.get<ApiResponse<PagedResult<Movie>>>(PREFIX, {
            params: {
                search: search || undefined,
                pageNumber: page,
                pageSize: pageSize,
            }
        });
        return response.data;
    },

    getById: async (id: number) => {
        const response = await api.get<ApiResponse<Movie>>(`${PREFIX}/${id}`);
        return response.data;
    },

    upload: async (file: File, title: string, description: string, poster?: File) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', title);
        formData.append('description', description);
        if (poster) {
            formData.append('poster', poster);
        }

        const response = await api.post<ApiResponse<Movie>>(`${PREFIX}/upload`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },

    update: async (id: number, title: string, description: string) => {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description || '');

        const response = await api.put<ApiResponse<Movie>>(`${PREFIX}/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },

    delete: async (id: number) => {
        const response = await api.delete<ApiResponse<null>>(`${PREFIX}/${id}`);
        return response.data;
    }
};

export default movieService;
