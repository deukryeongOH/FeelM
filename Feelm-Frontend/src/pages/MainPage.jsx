import React from 'react';
import { Film, Play, Smile, Heart } from 'lucide-react';

const MainPage = ({ onNavigate, user }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <div className="mb-8 animate-fade-in-up">
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
      </div>

      <button 
        onClick={() => onNavigate('recommend')}
        className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-600 hover:scale-105 hover:shadow-xl"
      >
        <Play className="w-5 h-5 mr-2 fill-current" />
        <span>영화 추천 시작하기</span>
        <div className="absolute -inset-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 opacity-20 group-hover:opacity-40 blur-lg transition-opacity duration-200" />
      </button>

      {/* 장식용 아이콘들 */}
      <div className="absolute top-1/4 left-10 opacity-10 animate-bounce duration-[3000ms]">
        <Smile size={64} color="white" />
      </div>
      <div className="absolute bottom-1/4 right-10 opacity-10 animate-bounce duration-[4000ms]">
        <Heart size={64} color="pink" />
      </div>
    </div>
  );
};

export default MainPage;