'use client';

import React, { useEffect, useState, use, useMemo } from 'react';
import { useMovie } from '@/hooks/useMovies';
import { BACKEND_URL, formatDate } from '@/lib/utils';
import dynamic from 'next/dynamic';
import Link from 'next/link';

// Load VideoPlayer as CSR only
const VideoPlayer = dynamic(() => import('@/components/VideoPlayer'), { 
  ssr: false,
  loading: () => <div className="aspect-video bg-gray-900 animate-pulse rounded-2xl flex items-center justify-center text-gray-500 font-bold uppercase tracking-widest text-[10px]">Khởi tạo...</div>
});

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function WatchPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const id = Number(resolvedParams.id);
  
  const [isMounted, setIsMounted] = useState(false);
  
  // TanStack Query Hook
  const { data: response, isLoading } = useMovie(id);
  const movie = response?.data;

  useEffect(() => { setIsMounted(true); }, []);

  const videoOptions = useMemo(() => {
    if (!movie) return null;
    return {
      autoplay: false,
      controls: true,
      responsive: true,
      fluid: false,
      poster: movie.posterUrl ? `${BACKEND_URL}${movie.posterUrl}` : undefined,
      sources: [{
        src: `${BACKEND_URL}${movie.hlsUrl}`,
        type: 'application/x-mpegURL'
      }]
    };
  }, [movie]);

  if (!isMounted) return <div className="min-h-screen bg-black"></div>;

  return (
    <main className="min-h-screen bg-black text-white p-4 md:p-8">
      <header className="max-w-7xl mx-auto flex justify-between items-center mb-6">
        <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white transition group">
          <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          <span className="font-bold uppercase tracking-widest text-[10px]">Quay lại</span>
        </Link>
      </header>

      {isLoading ? (
        <div className="max-w-7xl mx-auto aspect-video bg-gray-900 animate-pulse rounded-2xl flex items-center justify-center text-gray-500 font-bold uppercase tracking-widest text-[10px]">Đang tải phim...</div>
      ) : movie ? (
        <div className="max-w-7xl mx-auto">
          <div className="aspect-video bg-black rounded-3xl overflow-hidden border border-gray-800 shadow-2xl">
             {videoOptions && <VideoPlayer options={videoOptions} />}
          </div>
          
          <div className="mt-12 border-t border-gray-900 pt-8 pb-20">
            <h1 className="text-3xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500 tracking-tight uppercase">{movie.title}</h1>
            
            <div className="flex flex-wrap gap-4 items-center mt-6 mb-10">
                <div className="flex items-center gap-2 bg-red-600/10 text-red-500 text-[10px] font-black px-4 py-2 rounded-full border border-red-500/20 uppercase tracking-widest">
                   <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-ping"></div> STREAMING
                </div>
                <div className="text-gray-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 00-2 2z" /></svg>
                   Ngày đăng: {formatDate(movie.createdAt)}
                </div>
            </div>
            
            <div className="bg-gray-900/40 rounded-3xl p-8 border border-gray-800/50 backdrop-blur-md">
                <h3 className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-4">Mô tả</h3>
                <p className="text-gray-300 text-lg md:text-xl leading-relaxed whitespace-pre-wrap max-w-5xl">
                  {movie.description || 'Không có mô tả cho nội dung này.'}
                </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-950 rounded-2xl border border-dashed border-gray-800">
          <h2 className="text-xl font-bold text-gray-500 uppercase">Phim không tồn tại</h2>
          <Link href="/" className="mt-8 inline-block bg-red-600 px-8 py-3 rounded-full font-bold uppercase text-[10px] tracking-widest">Về trang chủ</Link>
        </div>
      )}
    </main>
  );
}
