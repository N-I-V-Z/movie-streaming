'use client';

import React, { useState, useEffect } from 'react';
import { useUploadMovie } from '@/hooks/useMovies';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function UploadPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [posterPreview, setPosterPreview] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  
  const uploadMutation = useUploadMovie();

  useEffect(() => { setIsMounted(true); }, []);

  const handlePosterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPosterFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPosterPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoFile || !title) return alert('Vui lòng chọn video và nhập tiêu đề.');

    uploadMutation.mutate(
      { file: videoFile, title, description, poster: posterFile || undefined },
      {
        onSuccess: () => {
          alert('Tải phim lên thành công!');
          router.push('/');
        },
        onError: (error: any) => {
          alert('Lỗi tải phim: ' + (error.response?.data?.message || error.message));
        }
      }
    );
  };

  if (!isMounted) return <div className="h-screen bg-gray-950"></div>;

  return (
    <main className="h-screen bg-gray-950 text-white overflow-hidden flex flex-col">
      <header className="px-8 h-16 flex items-center border-b border-gray-900 shrink-0">
        <div className="max-w-7xl w-full mx-auto flex justify-between items-center">
          <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white transition group">
            <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            <span className="font-bold uppercase tracking-widest text-[10px]">Trang chủ</span>
          </Link>
          <div className="flex items-center gap-2">
             <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Trình tải video</span>
          </div>
        </div>
      </header>

      <div className="flex-1 p-6 md:p-8 overflow-hidden">
        <form onSubmit={handleSubmit} className="max-w-7xl h-full mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          <div className="md:col-span-2 flex flex-col gap-6 h-full overflow-hidden">
            <div className="bg-gray-900 p-6 rounded-3xl border border-gray-800 flex flex-col shrink-0 shadow-xl">
              <div className="mb-4">
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Tên phim</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 focus:ring-1 focus:ring-red-500 outline-none transition-all font-bold" placeholder="Nhập tiêu đề..." required />
              </div>
              <div className="flex-1">
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Mô tả chi tiết</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 focus:ring-1 focus:ring-red-500 outline-none h-24 transition-all text-sm leading-relaxed resize-none" placeholder="Viết tóm tắt..." />
              </div>
            </div>

            <div className="bg-gray-900 p-6 rounded-3xl border border-gray-800 flex-1 flex flex-col shadow-xl overflow-hidden">
               <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4 shrink-0">Tệp tin Video</label>
               <div className="flex-1 border-2 border-dashed border-gray-800 rounded-2xl flex flex-col items-center justify-center hover:border-red-500/50 hover:bg-red-500/[0.01] transition-all cursor-pointer relative group">
                <input type="file" accept="video/mp4" onChange={(e) => setVideoFile(e.target.files?.[0] || null)} className="absolute inset-0 opacity-0 cursor-pointer" />
                {videoFile ? (
                  <div className="flex flex-col items-center p-4">
                     <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mb-3"><svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg></div>
                     <span className="text-white font-bold text-sm text-center line-clamp-1">{videoFile.name}</span>
                     <span className="text-gray-500 text-[10px] font-mono mt-1 uppercase tracking-widest">{(videoFile.size / (1024 * 1024)).toFixed(2)} MB</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center p-4 text-center">
                     <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform"><svg className="w-6 h-6 text-gray-600 group-hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg></div>
                     <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mb-1">Click hoặc Kéo thả video</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col h-full overflow-hidden">
            <div className="bg-gray-900 p-6 rounded-3xl border border-gray-800 shadow-2xl flex flex-col h-full overflow-hidden">
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Thumbnail</label>
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 bg-black rounded-2xl border-2 border-dashed border-gray-800 flex flex-col items-center justify-center relative overflow-hidden group transition-all hover:border-red-500/50">
                  {posterPreview ? (
                    <>
                      <img src={posterPreview} alt="Preview" className="w-full h-full object-contain" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><p className="text-white text-[9px] font-black uppercase tracking-widest bg-red-600 px-3 py-1.5 rounded-full">Thay đổi</p></div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center p-4 text-center">
                      <svg className="w-8 h-8 text-gray-700 mb-2 group-hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      <p className="text-gray-600 text-[9px] uppercase font-black tracking-widest">Ảnh tỉ lệ 16:9</p>
                    </div>
                  )}
                  <input type="file" accept="image/*" onChange={handlePosterChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
              </div>
              
              <div className="mt-6 space-y-4 shrink-0">
                {uploadMutation.isPending && (
                  <div className="space-y-2">
                      <div className="w-full bg-gray-800 rounded-full h-1 overflow-hidden shadow-inner"><div className="bg-red-600 h-full rounded-full animate-pulse w-full"></div></div>
                      <p className="text-[8px] text-red-500 font-black uppercase tracking-[0.3em] text-center">Đang xử lý...</p>
                  </div>
                )}
                <button type="submit" disabled={uploadMutation.isPending || !videoFile || !title} className="w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all bg-red-600 hover:bg-red-500 text-white disabled:opacity-50">
                  {uploadMutation.isPending ? 'Đang tải lên...' : 'Bắt đầu ngay'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
