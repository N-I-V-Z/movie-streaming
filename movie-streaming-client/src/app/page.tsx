'use client';

import React, { useEffect, useState } from 'react';
import { movieService } from '@/services/api';
import { Movie, PagedResult } from '@/types';
import Link from 'next/link';

export default function Home() {
  const [pagedData, setPagedData] = useState<PagedResult<Movie> | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchMovies(currentPage);
  }, [currentPage]);

  const fetchMovies = async (page: number) => {
    setLoading(true);
    try {
      const response = await movieService.getAll(page, 8);
      if (response.success && response.data) {
        setPagedData(response.data);
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách phim:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white p-8">
      <header className="flex justify-between items-center mb-12 max-w-7xl mx-auto">
        <div>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-500">
            HLS Movie Streaming
          </h1>
          <p className="text-gray-400 mt-2">Dự án xem phim sử dụng công nghệ HLS & DASH chuyên nghiệp.</p>
        </div>
        <Link 
          href="/upload" 
          className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-full font-medium transition duration-300"
        >
          Tải Phim Lên
        </Link>
      </header>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
        </div>
      ) : (
        <section className="max-w-7xl mx-auto">
          {pagedData && pagedData.items.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {pagedData.items.map((movie) => (
                  <Link 
                    key={movie.id} 
                    href={`/watch/${movie.id}`}
                    className="group bg-gray-900 rounded-xl overflow-hidden hover:scale-105 transition-transform duration-300 shadow-lg border border-gray-800"
                  >
                    <div className="aspect-[2/3] relative bg-gray-800 overflow-hidden">
                      {movie.posterUrl ? (
                        <img 
                          src={movie.posterUrl} 
                          alt={movie.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-600">
                          <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity flex items-center justify-center">
                        <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center scale-0 group-hover:scale-100 transition-transform duration-300">
                           <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 20 20"><path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.841z"/></svg>
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-lg truncate">{movie.title}</h3>
                      <p className="text-gray-500 text-sm mt-1 truncate">{movie.description || 'Không có mô tả'}</p>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination UI */}
              <div className="mt-16 flex justify-center gap-4 items-center">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-6 py-2 border border-gray-700 rounded-lg hover:bg-gray-800 disabled:opacity-30"
                >
                  Trước
                </button>
                <span className="text-gray-400">Trang {pagedData.pageNumber} / {pagedData.totalPages}</span>
                <button 
                  onClick={() => setCurrentPage(prev => Math.min(pagedData.totalPages, prev + 1))}
                  disabled={currentPage === pagedData.totalPages}
                  className="px-6 py-2 border border-gray-700 rounded-lg hover:bg-gray-800 disabled:opacity-30"
                >
                  Sau
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-20 bg-gray-900 rounded-2xl border-2 border-dashed border-gray-800">
              <h2 className="text-2xl font-semibold text-gray-500">Chưa có bộ phim nào được tải lên</h2>
              <Link href="/upload" className="mt-6 inline-block text-red-500 hover:underline">Hãy bắt đầu tải phim lên ngay</Link>
            </div>
          )}
        </section>
      )}
    </main>
  );
}
