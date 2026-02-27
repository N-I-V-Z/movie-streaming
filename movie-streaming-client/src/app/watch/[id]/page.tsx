'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { movieService } from '@/services/api';
import { Movie } from '@/types';
import dynamic from 'next/dynamic';
import Link from 'next/link';

// Load VideoPlayer as CSR only (no SSR for video.js)
const VideoPlayer = dynamic(() => import('@/components/VideoPlayer'), { 
  ssr: false,
  loading: () => <div className="aspect-video bg-gray-900 animate-pulse rounded-xl flex items-center justify-center">Đang khởi tạo trình phát...</div>
});

export default function WatchPage() {
  const { id } = useParams();
  const router = useRouter();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);

  const BACKEND_URL = 'http://localhost:5041'; // Đảm bảo khớp port

  useEffect(() => {
    if (id) {
      fetchMovie();
    }
  }, [id]);

  const fetchMovie = async () => {
    setLoading(true);
    try {
      const response = await movieService.getById(Number(id));
      if (response.success && response.data) {
        setMovie(response.data);
      }
    } catch (error) {
      console.error('Lỗi lấy chi tiết phim:', error);
    } finally {
      setLoading(false);
    }
  };

  const videoOptions = movie ? {
    autoplay: false,
    controls: true,
    responsive: true,
    fluid: true,
    sources: [{
      src: `${BACKEND_URL}${movie.hlsUrl}`,
      type: 'application/x-mpegURL'
    }]
  } : null;

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition">
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        Quay lại Trang chủ
      </Link>

      {loading ? (
        <div className="max-w-6xl mx-auto h-96 bg-gray-900 animate-pulse rounded-2xl flex items-center justify-center">Đang tải phim...</div>
      ) : movie ? (
        <div className="max-w-6xl mx-auto">
          <div className="shadow-2xl shadow-red-500/10">
             {videoOptions && <VideoPlayer options={videoOptions} />}
          </div>
          
          <div className="mt-8 border-t border-gray-900 pt-8">
            <h1 className="text-4xl font-bold">{movie.title}</h1>
            <div className="flex gap-4 items-center mt-4 mb-6">
                <span className="bg-red-600/20 text-red-500 text-xs font-bold px-3 py-1 rounded border border-red-500/20 uppercase">HLS Streaming</span>
                <span className="text-gray-500 text-sm">Cập nhật: {new Date(movie.createdAt).toLocaleDateString('vi-VN')}</span>
            </div>
            <p className="text-gray-300 text-lg leading-relaxed max-w-4xl whitespace-pre-wrap">
              {movie.description || 'Không có mô tả chi tiết cho bộ phim này.'}
            </p>
          </div>
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-950 rounded-2xl">
          <h2 className="text-2xl font-semibold text-gray-500">Phim không tồn tại</h2>
          <Link href="/" className="mt-6 inline-block text-red-500 hover:underline">Về trang chủ</Link>
        </div>
      )}
    </main>
  );
}
