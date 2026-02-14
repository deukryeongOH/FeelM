import React from 'react';
import { Star } from 'lucide-react';

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

const MovieCard = ({ movie, onClick }) => {
  const posterSrc = movie.poster_url?.startsWith('http') 
    ? movie.poster_url 
    : `${IMAGE_BASE_URL}${movie.poster_url}`;

  return (
    <div 
      onClick={onClick}
      className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 border border-gray-700 group h-full flex flex-col cursor-pointer ring-offset-2 ring-offset-gray-900 focus:ring-2 focus:ring-purple-500"
    >
      <div className="relative aspect-[2/3] overflow-hidden shrink-0">
        <img 
          src={posterSrc}
          alt={movie.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {e.target.src = "https://via.placeholder.com/300x450?text=No+Image"}}
        />
        <div className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded text-xs font-bold text-white border border-white/20">
          {movie.certification || 'ALL'}세
        </div>
        
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
             <span className="text-white border border-white/50 px-3 py-1 rounded-full text-sm backdrop-blur-sm">상세정보 보기</span>
        </div>
      </div>

      <div className="p-5 text-left flex flex-col flex-1">
        {/* 제목은 한 줄이나 두 줄로 제한해야 카드 높이가 더 일정해집니다 (옵션) */}
        <h3 className="text-xl font-bold mb-2 truncate text-purple-100 h-8">{movie.title}</h3>
        
        <div className="flex items-center gap-1 text-yellow-400 mb-3">
          <Star size={16} fill="currentColor" />
          <span className="font-bold">{movie.rate}</span>
        </div>
        
        {/* [핵심 수정] 높이 고정(h-24) + 스크롤(overflow-y-auto) 추가 */}
        {/* pr-2: 스크롤바와 글자 사이 간격 */}
        <p className="text-gray-400 text-sm leading-relaxed h-24 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
          {movie.plot}
        </p>
      </div>
    </div>
  );
};

export default MovieCard;