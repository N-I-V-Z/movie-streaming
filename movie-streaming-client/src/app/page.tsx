'use client';

import React, { useEffect, useState } from 'react';
import { useMovies, useDeleteMovie, useUpdateMovie } from '@/hooks/useMovies';
import { Movie } from '@/types';
import { MovieCard } from '@/components/MovieCard';
import Link from 'next/link';

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [inputValue, setInputValue] = useState('');
  
  // States cho Modal
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');

  // TanStack Query Hooks
  const { data: response, isLoading, isPlaceholderData } = useMovies(searchTerm, currentPage);
  const deleteMutation = useDeleteMovie();
  const updateMutation = useUpdateMovie();

  useEffect(() => { setIsMounted(true); }, []);

  // Debounce Search
  useEffect(() => {
    if (!isMounted) return;
    const handler = setTimeout(() => {
      setSearchTerm(inputValue);
      setCurrentPage(1);
    }, 800);
    return () => clearTimeout(handler);
  }, [inputValue, isMounted]);

  const handleDelete = (movie: Movie) => {
    if (confirm(`Xóa phim "${movie.title}"?`)) {
      deleteMutation.mutate(movie.id);
    }
  };

  const handleUpdate = () => {
    if (!editingMovie) return;
    updateMutation.mutate(
      { id: editingMovie.id, title: editTitle, description: editDesc },
      { onSuccess: () => setEditingMovie(null) }
    );
  };

  if (!isMounted) return <div className="min-h-screen bg-black"></div>;

  const pagedData = response?.data;

  return (
    <main className="min-h-screen bg-[#050505] text-white p-6 md:p-12">
      <header className="flex flex-col lg:flex-row justify-between items-end mb-20 max-w-7xl mx-auto gap-10">
        <div className="space-y-2">
          <div className="flex items-center gap-3 mb-4">
             <div className="w-12 h-1.5 bg-red-600 rounded-full"></div>
             <span className="text-xs font-black uppercase tracking-[0.4em] text-red-500">Khám phá</span>
          </div>
          <h1 className="text-6xl font-extrabold tracking-tighter">Movie<span className="text-red-600">.</span>Library</h1>
        </div>
        
        <div className="flex items-center gap-6 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-[400px]">
            <input 
              type="text" 
              placeholder="Tìm kiếm phim..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-red-500/50 focus:bg-white/10 transition-all font-medium"
            />
            <div className="absolute right-5 top-4 flex items-center gap-3">
               {inputValue !== searchTerm && <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>}
               <svg className={`w-6 h-6 ${searchTerm ? 'text-red-500' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
          </div>
          <Link href="/upload" className="bg-red-600 hover:bg-red-700 px-10 py-4 rounded-2xl font-bold text-sm uppercase tracking-widest shadow-[0_0_40px_rgba(220,38,38,0.3)] transition-all">Tải lên</Link>
        </div>
      </header>

      {isLoading && !isPlaceholderData ? (
        <div className="flex flex-col justify-center items-center h-96 gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-red-600"></div>
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-600 italic">Đang tải...</span>
        </div>
      ) : (
        <section className="max-w-7xl mx-auto">
          {pagedData && pagedData.items.length > 0 ? (
            <>
              <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 transition-opacity duration-300 ${isPlaceholderData ? 'opacity-50' : 'opacity-100'}`}>
                {pagedData.items.map((movie) => (
                  <MovieCard 
                    key={movie.id} 
                    movie={movie} 
                    onEdit={(m) => { setEditingMovie(m); setEditTitle(m.title); setEditDesc(m.description || ''); }} 
                    onDelete={handleDelete} 
                  />
                ))}
              </div>

              <div className="mt-24 pb-20 flex justify-center gap-4 items-center">
                 {Array.from({ length: pagedData.totalPages }, (_, i) => i + 1).map(page => (
                    <button 
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-12 h-12 rounded-2xl border transition-all font-black text-xs ${currentPage === page ? 'bg-white border-white text-black shadow-xl scale-110' : 'bg-transparent border-white/10 text-gray-600 hover:text-white'}`}
                    >
                      {String(page).padStart(2, '0')}
                    </button>
                 ))}
              </div>
            </>
          ) : (
            <div className="text-center py-40 bg-[#0a0a0a] rounded-[3rem] border border-white/5">
              <h2 className="text-3xl font-black text-gray-800 tracking-tighter uppercase opacity-50">Thư viện trống</h2>
              {searchTerm && <button onClick={() => setInputValue('')} className="mt-4 text-red-500 font-bold text-xs uppercase tracking-widest">Xóa tìm kiếm</button>}
            </div>
          )}
        </section>
      )}

      {/* Edit Modal */}
      {editingMovie && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-3xl flex items-center justify-center p-4 z-50">
           <div className="bg-[#0a0a0a] border border-white/10 p-12 rounded-[2.5rem] w-full max-w-xl shadow-2xl animate-in zoom-in-95 duration-300">
              <h2 className="text-3xl font-black uppercase tracking-tighter mb-12 flex items-center gap-4">
                 <div className="w-1.5 h-10 bg-red-600 rounded-full"></div> Chỉnh sửa phim
              </h2>
              <div className="space-y-8">
                <div>
                  <label className="block text-[10px] font-black text-gray-600 uppercase tracking-widest mb-4">Tiêu đề</label>
                  <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-red-500 outline-none font-bold" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-600 uppercase tracking-widest mb-4">Mô tả</label>
                  <textarea rows={5} value={editDesc} onChange={(e) => setEditDesc(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-red-500 outline-none resize-none" />
                </div>
              </div>
              <div className="flex justify-end gap-10 mt-12">
                <button onClick={() => setEditingMovie(null)} className="text-[10px] font-black text-gray-600 hover:text-white uppercase tracking-widest">Hủy bỏ</button>
                <button 
                  onClick={handleUpdate} 
                  disabled={updateMutation.isPending} 
                  className="bg-white text-black px-12 py-4 rounded-2xl font-black text-xs uppercase transition-all active:scale-95 disabled:opacity-50"
                >
                  {updateMutation.isPending ? 'Đang lưu...' : 'Cập nhật'}
                </button>
              </div>
           </div>
        </div>
      )}
    </main>
  );
}
