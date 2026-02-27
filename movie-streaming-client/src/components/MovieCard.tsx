'use client';

import React from 'react';
import Link from 'next/link';
import { Movie } from '@/types';
import { getPosterUrl, formatDate } from '@/lib/utils';

interface MovieCardProps {
    movie: Movie;
    onEdit: (movie: Movie) => void;
    onDelete: (movie: Movie) => void;
}

export const MovieCard = ({ movie, onEdit, onDelete }: MovieCardProps) => {
    return (
        <div className="group relative bg-[#111] rounded-[2rem] overflow-hidden border border-white/5 hover:border-white/10 transition-all duration-500 flex flex-col shadow-2xl">
            {/* Thumbnail Section */}
            <div className="aspect-[16/10] relative bg-black flex items-center justify-center overflow-hidden">
                {movie.posterUrl ? (
                    <img
                        src={getPosterUrl(movie.posterUrl)!}
                        alt={movie.title}
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                    />
                ) : (
                    <div className="text-gray-800 font-black text-[10px] uppercase tracking-widest text-center px-4">
                        Không có ảnh bìa
                    </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent opacity-60"></div>

                <Link href={`/watch/${movie.id}`} className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-black/20">
                    <div className="w-16 h-16 bg-white text-black rounded-full flex items-center justify-center shadow-2xl scale-75 group-hover:scale-100 transition-transform duration-500">
                        <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.841z" />
                        </svg>
                    </div>
                </Link>

                <div className="absolute top-5 right-5 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0">
                    <button
                        onClick={(e) => { e.preventDefault(); onEdit(movie); }}
                        className="p-3 bg-white/10 hover:bg-blue-600 rounded-2xl text-white backdrop-blur-xl border border-white/10 shadow-2xl transition-all active:scale-90"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                    </button>
                    <button
                        onClick={(e) => { e.preventDefault(); onDelete(movie); }}
                        className="p-3 bg-white/10 hover:bg-red-600 rounded-2xl text-white backdrop-blur-xl border border-white/10 shadow-2xl transition-all active:scale-90"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-8 flex flex-col flex-1">
                <h3 className="font-bold text-xl line-clamp-1 group-hover:text-red-500 transition-colors tracking-tight uppercase mb-4">
                    {movie.title}
                </h3>
                <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed font-medium flex-1 mb-6">
                    {movie.description || 'Không có mô tả chi tiết cho nội dung này.'}
                </p>
                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                    <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">
                        {formatDate(movie.createdAt)}
                    </span>
                    <Link href={`/watch/${movie.id}`} className="text-[10px] font-black text-red-500 uppercase tracking-[0.2em] hover:text-red-400 transition-colors">
                        Xem ngay →
                    </Link>
                </div>
            </div>
        </div>
    );
};
