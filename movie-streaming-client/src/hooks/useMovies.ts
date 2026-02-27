import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { movieService } from '@/services/movieService';

// Keys để quản lý Cache
export const movieKeys = {
    all: ['movies'] as const,
    list: (search: string, page: number) => [...movieKeys.all, 'list', { search, page }] as const,
    detail: (id: number) => [...movieKeys.all, 'detail', id] as const,
};

/**
 * Hook lấy danh sách phim (Query)
 */
export const useMovies = (search: string, page: number) => {
    return useQuery({
        queryKey: movieKeys.list(search, page),
        queryFn: () => movieService.getAll(search, page, 6),
        placeholderData: (previousData) => previousData, // Giữ dữ liệu cũ trong lúc load trang mới (UX mượt)
    });
};

/**
 * Hook lấy chi tiết một bộ phim (Query)
 */
export const useMovie = (id: number) => {
    return useQuery({
        queryKey: movieKeys.detail(id),
        queryFn: () => movieService.getById(id),
        enabled: !!id, // Chỉ chạy khi có id
    });
};

/**
 * Hook tải phim mới lên (Mutation)
 */
export const useUploadMovie = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ file, title, description, poster }: { file: File, title: string, description: string, poster?: File }) => 
            movieService.upload(file, title, description, poster),
        onSuccess: () => {
            // Tự động làm mới danh sách phim sau khi upload
            queryClient.invalidateQueries({ queryKey: movieKeys.all });
        }
    });
};

/**
 * Hook cập nhật phim (Mutation)
 */
export const useUpdateMovie = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, title, description }: { id: number, title: string, description: string }) => 
            movieService.update(id, title, description),
        onSuccess: (response) => {
            if (response.success) {
                // Cập nhật lại cache danh sách và chi tiết
                queryClient.invalidateQueries({ queryKey: movieKeys.all });
            }
        }
    });
};

/**
 * Hook xóa phim (Mutation)
 */
export const useDeleteMovie = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => movieService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: movieKeys.all });
        }
    });
};
