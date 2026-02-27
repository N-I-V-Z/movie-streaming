export const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5041';

/**
 * Lấy URL đầy đủ cho Poster/Thumbnail
 */
export const getPosterUrl = (url?: string) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    return `${BACKEND_URL}${url}`;
};

/**
 * Định dạng ngày tháng theo chuẩn: 27 tháng 2, 2026
 */
export const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
};
