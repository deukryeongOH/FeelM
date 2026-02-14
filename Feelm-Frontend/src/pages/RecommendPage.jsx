import React, { useState } from 'react';
import { Smile, Frown, Heart, ArrowLeft, Ghost, User } from 'lucide-react';
import MovieCard from '../components/MovieCard';
import MovieDetailModal from '../components/MovieDetailModal';

const RecommendPage = ({ user, onNavigate }) => {
  const [recommendedMovies, setRecommendedMovies] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMood, setSelectedMood] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);

  const moods = [
    { label: '행복함', feelId: 1, feelType: 'Happy', icon: <Smile className="text-yellow-400" /> },
    { label: '우울함', feelId: 2, feelType: 'Sad', icon: <Frown className="text-blue-400" /> },
    { label: '설렘', feelId: 3, feelType: 'Flutter', icon: <Heart className="text-pink-400" /> },
    { label: '공포', feelId: 4, feelType: 'Fear', icon: <Ghost className="text-purple-500" /> },
    { label: '외로움', feelId: 5, feelType: 'Lonely', icon: <User className="text-gray-400" /> }
  ];

  const handleMoodSelect = async (mood) => {
    // 1. 로그인 여부 1차 확인 (UI 상태 기준)
    if (!user) {
      alert('로그인이 필요한 서비스입니다.');
      onNavigate('login');
      return;
    }

    // [수정] 토큰은 localStorage에서 직접 가져옵니다.
    const token = localStorage.getItem('accessToken');

    // 2. 토큰 존재 여부 2차 확인 (보안)
    if (!token) {
        alert('로그인 세션이 만료되었습니다. 다시 로그인해주세요.');
        onNavigate('login');
        return;
    }

    setSelectedMood(mood.label);
    setIsLoading(true);
    setRecommendedMovies(null);

    try {
      const requestBody = {
        feelId: mood.feelId,
        feelType: mood.feelType
      };

      const response = await fetch('http://localhost:8080/api/movie/recommend', {
        method: 'POST',
        headers: {
          // [수정] user.accessToken 대신 위에서 가져온 token 변수 사용
          'Authorization': `Bearer ${token}`, 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (response.ok) {
        const data = await response.json();
        setRecommendedMovies(data);
      } else if (response.status === 403 || response.status === 401) {
        // [수정] 인증 실패(403, 401) 시 처리 추가
        alert('권한이 없거나 로그인이 만료되었습니다.');
        onNavigate('login');
      } else {
        alert('영화 추천을 불러오는데 실패했습니다.');
      }
    } catch (error) {
      console.error('Recommend Error:', error);
      alert('서버와 통신 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-[60vh] text-white w-full">
      {selectedMovie && (
        <MovieDetailModal 
          movie={selectedMovie} 
          onClose={() => setSelectedMovie(null)} 
        />
      )}

      {recommendedMovies ? (
        <div className="w-full max-w-6xl animate-fade-in">
          <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
            <div>
              <h2 className="text-3xl font-bold">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">{selectedMood}</span> 기분엔 이런 영화 어때요?
              </h2>
              <p className="text-gray-400 mt-2">Feelm이 엄선한 5가지 추천작입니다.</p>
            </div>
            <button 
              onClick={() => setRecommendedMovies(null)}
              className="flex items-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-full transition-colors"
            >
              <ArrowLeft size={18} /> 다른 기분 선택하기
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {recommendedMovies.map((movie, idx) => (
              <MovieCard key={idx} movie={movie} onClick={() => setSelectedMovie(movie)}/>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center w-full h-full my-auto animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">지금 기분이 어떠신가요?</h2>
          <p className="text-gray-400 mb-12 text-lg">당신의 현재 감정을 선택해주시면, 딱 맞는 영화를 처방해드릴게요.</p>
          
          {isLoading ? (
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-purple-300 animate-pulse text-lg">영화를 찾고 있어요...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-10">
              {moods.map((mood, idx) => (
                <button 
                  key={idx} 
                  onClick={() => handleMoodSelect(mood)}
                  className="group relative w-40 h-40 md:w-48 md:h-48 bg-gray-800/50 hover:bg-gray-800 border border-gray-700 hover:border-purple-500 rounded-2xl transition-all duration-300 flex flex-col items-center justify-center gap-4 hover:-translate-y-2 hover:shadow-purple-500/20 hover:shadow-2xl backdrop-blur-sm"
                >
                  <div className="w-16 h-16 rounded-full bg-gray-700/50 group-hover:bg-gray-700 flex items-center justify-center transition-colors text-3xl md:text-4xl shadow-inner">
                    {mood.icon}
                  </div>
                  <span className="text-lg font-medium text-gray-300 group-hover:text-white transition-colors">{mood.label}</span>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RecommendPage;