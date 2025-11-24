import React from 'react';
import { User } from 'lucide-react';

const ProfilePage = ({ user, onNavigate }) => {
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-white">
        <h2 className="text-2xl font-bold mb-4">로그인이 필요한 서비스입니다.</h2>
        <button 
          onClick={() => onNavigate('login')}
          className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-full font-bold transition-colors"
        >
          로그인 하러 가기
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-white w-full max-w-2xl mx-auto">
      <div className="w-28 h-28 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-6 shadow-lg">
        <User size={56} className="text-white" />
      </div>
      <h2 className="text-3xl font-bold mb-8">내 프로필</h2>
      
      <div className="w-full bg-gray-800 rounded-xl shadow-2xl border border-gray-700 p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center border-b border-gray-700 pb-4">
          <span className="text-gray-400 w-32 text-sm md:text-base mb-1 md:mb-0">이름</span>
          <span className="text-lg font-medium">{user.name}</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center border-b border-gray-700 pb-4">
          <span className="text-gray-400 w-32 text-sm md:text-base mb-1 md:mb-0">이메일</span>
          <span className="text-lg font-medium">{user.email}</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-700 pb-4">
          <div className="flex flex-col md:flex-row md:items-center flex-1">
            <span className="text-gray-400 w-32 text-sm md:text-base mb-1 md:mb-0">계정 아이디</span>
            <span className="text-lg font-medium">{user.accountId}</span>
          </div>
          <button className="mt-2 md:mt-0 px-4 py-2 bg-gray-700 hover:bg-purple-600 text-white text-sm rounded-lg transition-colors whitespace-nowrap">
            변경
          </button>
        </div>
        
         <div className="flex flex-col md:flex-row md:items-center justify-between pb-2">
          <div className="flex flex-col md:flex-row md:items-center flex-1">
            <span className="text-gray-400 w-32 text-sm md:text-base mb-1 md:mb-0">비밀번호</span>
            <span className="text-lg font-medium tracking-widest text-purple-300">********</span>
          </div>
          <button className="mt-2 md:mt-0 px-4 py-2 bg-gray-700 hover:bg-purple-600 text-white text-sm rounded-lg transition-colors whitespace-nowrap">
            변경
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;