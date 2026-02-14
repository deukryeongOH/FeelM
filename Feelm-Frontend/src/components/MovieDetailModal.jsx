import React, { useState } from 'react';
import { X, Star, Calendar, PlayCircle, Search, ExternalLink } from 'lucide-react'; 
// Film 아이콘 import 제거

const MovieDetailModal = ({ movie, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original";
  const backdropSrc = movie.poster_url 
    ? (movie.poster_url.startsWith('http') ? movie.poster_url : `${IMAGE_BASE_URL}${movie.poster_url}`)
    : "https://via.placeholder.com/800x450?text=No+Image";

  const getYouTubeId = (url) => {
    if (!url || typeof url !== 'string') return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const youtubeId = getYouTubeId(movie.trailer_url);

  const handleTrailerFallback = (e) => {
    e.stopPropagation();
    const query = encodeURIComponent(`${movie.title} 메인 예고편`);
    window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      <div className="relative w-full max-w-4xl h-[85vh] bg-gray-900 rounded-2xl overflow-hidden shadow-2xl border border-gray-700 flex flex-col">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 bg-black/60 hover:bg-gray-700 rounded-full text-white transition-colors"
        >
          <X size={24} />
        </button>

        {/* === 상단 비디오 영역 === */}
        <div className="w-full h-[45%] bg-black relative shrink-0">
          {isPlaying && youtubeId ? (
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          ) : (
            <div 
              className="w-full h-full relative cursor-pointer group"
              onClick={(e) => youtubeId ? setIsPlaying(true) : handleTrailerFallback(e)}
            >
              <img 
                src={backdropSrc} 
                alt={movie.title} 
                className="w-full h-full object-cover opacity-70 group-hover:opacity-50 transition-all duration-300"
              />
              
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="flex flex-col items-center transform group-hover:scale-110 transition-transform duration-300">
                  {youtubeId ? (
                    <>
                      <PlayCircle size={70} className="text-white fill-white/20 drop-shadow-lg group-hover:text-purple-400" />
                      <span className="mt-3 text-white font-bold text-lg drop-shadow-md bg-black/40 px-3 py-1 rounded-full">
                        예고편 재생
                      </span>
                    </>
                  ) : (
                    <>
                      <Search size={60} className="text-white drop-shadow-lg group-hover:text-blue-400" />
                      <div className="mt-3 flex items-center gap-2 text-white font-bold text-lg drop-shadow-md bg-black/60 px-4 py-2 rounded-full border border-white/20">
                        <span>유튜브에서 찾아보기</span>
                        <ExternalLink size={16} />
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
            </div>
          )}
        </div>

        {/* === 하단 상세 정보 영역 === */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-gray-900 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
          <div className="flex flex-col gap-6">
            
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-gray-700 pb-6">
              <div className="flex-1">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">{movie.title}</h2>
                <div className="flex flex-wrap items-center gap-3 text-sm md:text-base text-gray-300">
                  <span className={`px-2 py-0.5 rounded font-bold border text-xs ${
                    movie.certification === '19' ? 'border-red-500 text-red-400' : 
                    movie.certification === '15' ? 'border-yellow-500 text-yellow-400' : 
                    'border-green-500 text-green-400'
                  }`}>
                    {movie.certification || 'ALL'}
                  </span>
                  
                  {/* [수정] 장르 표시 부분 삭제됨 */}

                  <span className="w-1 h-1 rounded-full bg-gray-500"></span>
                  <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {movie.release_date || '2025'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-gray-800/80 px-4 py-2 rounded-xl border border-gray-700 shrink-0">
                <Star size={24} className="text-yellow-400 fill-yellow-400" />
                <span className="text-2xl font-bold text-white">{movie.rate}</span>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-purple-200 mb-3">줄거리</h3>
              {/* 이미 제한 코드는 없음. 여기서도 잘리면 DB 문제임 */}
              <p className="text-gray-300 leading-relaxed text-lg whitespace-pre-line">
                {movie.plot}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailModal;