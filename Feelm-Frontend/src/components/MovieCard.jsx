import React from 'react';
import { Star } from 'lucide-react';

// TMDB 이미지 기본 주소 정의
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

const MovieCard = ({ movie }) => {
  // 포스터 URL 가공 로직
  // DB에 저장된 URL이 'http'로 시작하면 그대로 쓰고, 아니면 앞에 기본 주소를 붙임
  const posterSrc = movie.poster_url?.startsWith('http') 
    ? movie.poster_url 
    : `${IMAGE_BASE_URL}${movie.poster_url}`;

  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 border border-gray-700 group h-full flex flex-col">
      {/* 포스터 이미지 영역 */}
      <div className="relative aspect-[2/3] overflow-hidden shrink-0">
        <img 
          src={posterSrc} // 가공된 URL 사용
          alt={movie.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {e.target.src = "https://via.placeholder.com/300x450?text=No+Image"}}
        />
        <div className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded text-xs font-bold text-white border border-white/20">
          {movie.certification || 'ALL'}세 관람가
        </div>
      </div>

      {/* 정보 영역 */}
      <div className="p-5 text-left flex flex-col flex-1">
        <h3 className="text-xl font-bold mb-2 truncate text-purple-100">{movie.title}</h3>
        <div className="flex items-center gap-1 text-yellow-400 mb-3">
          <Star size={16} fill="currentColor" />
          <span className="font-bold">{movie.rate}</span>
        </div>
        
        {/* 줄거리 영역: 평소엔 line-clamp-3, 마우스 올리면 스크롤 가능 */}
        {/* max-h-[120px]로 높이 제한을 두어 카드가 너무 길어지는 것을 방지함 */}
        <p className="text-gray-400 text-sm leading-relaxed 
                      line-clamp-3 
                      group-hover:line-clamp-none group-hover:overflow-y-auto group-hover:max-h-[120px] 
                      scrollbar-hide transition-all duration-300">
          {movie.plot}
        </p>
      </div>
    </div>
  );
};

export default MovieCard;