import React, { useState, useEffect } from 'react';
import { Film, Play, Smile, Heart } from 'lucide-react';

const MainPage = ({ onNavigate, user }) => {
  const [movies, setMovies] = useState([]);

  // 컴포넌트 마운트 시 API 호출
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        // 백엔드 API 호출 (랜덤 or 최신 영화 20개)
        const response = await fetch('http://localhost:8080/api/movie/slider');
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setMovies(data);
      } catch (error) {
        console.error("영화 데이터를 불러오는데 실패했습니다:", error);
        setMovies([]); // 에러 발생 시 빈 배열로 설정
      }
    };

    fetchMovies();
  }, []);

  return (
    // min-h-screen으로 전체 화면 확보, pb-40으로 컨텐츠 상단 이동
    <div className="relative flex flex-col items-center justify-center min-h-screen pb-40 text-center px-4 overflow-hidden">
      
      {/* 애니메이션 스타일 정의 */}
      <style>
        {`
          @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-infinite-scroll {
            display: flex;
            width: max-content;
            animation: scroll 60s linear infinite; /* 속도 조절: 숫자가 클수록 느려짐 */
          }
          .animate-infinite-scroll:hover {
            animation-play-state: paused;
          }
        `}
      </style>

      {/* 메인 컨텐츠 영역 */}
      <div className="relative z-10 animate-fade-in-up">
        <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full shadow-lg mb-6">
          <Film size={48} className="text-white" />
        </div>
        <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-4">
          Feelm
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 font-light mb-2">
          당신의 기분에 딱 맞는 영화를 처방해드립니다.
        </p>
        <p className="text-gray-400 mb-10">
          {user ? `${user.name}님, ` : ''}오늘 어떤 감정을 느끼고 계신가요? 그 감정에 공감하거나, 혹은 위로가 될 이야기를 찾아드릴게요.
        </p>

        <button 
          onClick={() => onNavigate('recommend')}
          className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-600 hover:scale-105 hover:shadow-xl"
        >
          <Play className="w-5 h-5 mr-2 fill-current" />
          <span>영화 추천 시작하기</span>
          <div className="absolute -inset-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 opacity-20 group-hover:opacity-40 blur-lg transition-opacity duration-200" />
        </button>
      </div>

      {/* 배경 장식용 아이콘 */}
      <div className="absolute top-1/4 left-10 opacity-10 animate-bounce duration-[3000ms]">
        <Smile size={64} color="white" />
      </div>
      <div className="absolute bottom-1/4 right-10 opacity-10 animate-bounce duration-[4000ms]">
        <Heart size={64} color="pink" />
      </div>

      {/* 🎬 하단 무한 스크롤 슬라이더 */}
      <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent flex items-end pb-8">
        
        {/* 좌우 그라데이션 (자연스럽게 사라지는 효과) */}
        <div className="absolute top-0 left-0 h-full w-20 bg-gradient-to-r from-gray-900 to-transparent z-20 pointer-events-none" />
        <div className="absolute top-0 right-0 h-full w-20 bg-gradient-to-l from-gray-900 to-transparent z-20 pointer-events-none" />

        {/* 영화 데이터가 있을 때만 렌더링 */}
        {movies.length > 0 && (
          <div className="animate-infinite-scroll hover:pause">
            {/* 리스트를 2배로 복사하여 무한 스크롤 구현 */}
            {[...movies, ...movies].map((movie, index) => {
              // 이미지 URL 처리 로직
              // 1. poster_path가 없으면 null
              // 2. http로 시작하면 그대로 사용
              // 3. 파일명이면 TMDB URL 붙여서 사용
              const imageUrl = !movie.poster_path 
                ? null 
                : movie.poster_path.startsWith('http') 
                  ? movie.poster_path 
                  : `https://image.tmdb.org/t/p/w200${movie.poster_path}`;

              return (
                <div 
                  key={`${movie.id}-${index}`} 
                  className="relative w-32 h-48 mx-3 transition-transform duration-300 hover:scale-110 hover:z-10 rounded-lg overflow-hidden shadow-lg border border-gray-700 group cursor-pointer bg-gray-800"
                >
                  <img 
                    src={imageUrl || "https://via.placeholder.com/200x300/333333/ffffff?text=No+Image"} 
                    alt={movie.title} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                       e.target.onerror = null; 
                       e.target.src = "https://via.placeholder.com/200x300/333333/ffffff?text=No+Image";
                    }}
                  />
                  {/* 호버 시 제목 오버레이 */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2">
                    <span className="text-white text-xs text-center font-medium">{movie.title}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};

export default MainPage;