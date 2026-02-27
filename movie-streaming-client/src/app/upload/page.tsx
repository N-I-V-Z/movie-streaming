'use client';

import React, { useState } from 'react';
import { movieService } from '@/services/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function UploadPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title) return alert('Vui lòng chọn file và nhập tiêu đề.');

    setUploading(true);
    setProgress(10); // Khởi đầu giả lập

    try {
      const response = await movieService.upload(file, title, description);
      if (response.success) {
        setProgress(100);
        setTimeout(() => {
          router.push('/');
        }, 1000);
      } else {
          alert('Lỗi: ' + response.message);
      }
    } catch (error: any) {
        console.error('Lỗi upload:', error);
        alert('Lỗi hệ thống: ' + (error.response?.data?.message || error.message));
    } finally {
        setUploading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white p-8">
      <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition">
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        Quay lại Trang chủ
      </Link>

      <div className="max-w-2xl mx-auto bg-gray-900 p-8 rounded-2xl shadow-xl border border-gray-800">
        <h1 className="text-3xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-500">Tải Phim Mới Lên Hệ Thống</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Tên Phim</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-500 outline-none"
              placeholder="Nhập tên phim"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Mô Tả</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-500 outline-none h-32"
              placeholder="Nhập mô tả phim"
            />
          </div>

          <div className="border-2 border-dashed border-gray-700 rounded-xl p-10 text-center hover:border-red-500 transition cursor-pointer relative">
            <input 
              type="file" 
              accept="video/mp4" 
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            {file ? (
              <div className="flex flex-col items-center">
                 <svg className="w-12 h-12 text-green-500 mb-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                 <span className="text-white font-medium">{file.name}</span>
                 <span className="text-gray-500 text-sm mt-1">{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                 <svg className="w-12 h-12 text-gray-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                 <span className="text-gray-400">Chọn file phim (.mp4)</span>
                 <span className="text-gray-600 text-sm mt-1">Dung lượng tối đa đề xuất: 1GB</span>
              </div>
            )}
          </div>

          {uploading && (
             <div className="mt-4">
                <div className="w-full bg-gray-800 rounded-full h-2.5">
                   <div className="bg-red-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                </div>
                <p className="text-center text-sm text-gray-400 mt-2 italic">Hệ thống đang xử lý Convert Video sang HLS. Vui lòng không tắt trang web...</p>
             </div>
          )}

          <button 
            type="submit" 
            disabled={uploading || !file}
            className={`w-full py-4 rounded-xl font-bold text-lg transition duration-300 ${uploading || !file ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 shadow-lg shadow-red-900/20'}`}
          >
            {uploading ? 'Đang Xử Lý...' : 'Bắt Đầu Tải Lên'}
          </button>
        </form>
      </div>
    </main>
  );
}
