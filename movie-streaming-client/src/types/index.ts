export interface Movie {
    id: number;
    title: string;
    description: string;
    hlsUrl: string;
    posterUrl?: string;
    createdAt: string;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    errors: string[] | null;
}

export interface PagedResult<T> {
    items: T[];
    pageNumber: number;
    pageSize: number;
    totalRecords: number;
    totalPages: number;
}
