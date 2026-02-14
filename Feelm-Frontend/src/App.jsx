import React, { useState, useEffect } from 'react';
import { Film, User, LogIn, UserPlus, LogOut } from 'lucide-react';

// 페이지 컴포넌트 임포트
import MainPage from './pages/MainPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProfilePage from './pages/ProfilePage';
import RecommendPage from './pages/RecommendPage';

export default function App() {
  const [currentView, setCurrentView] = useState('home');
  const [user, setUser] = useState(null);
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const storedUser = localStorage.getItem('user'); // 사용자 이름도 저장했다고 가정

    if (accessToken && storedUser) {
      // 토큰과 이름이 있으면 로그인 상태로 설정
      setUser(JSON.parse(storedUser));
    }
  }, []);
  
  const handleLoginSuccess = (userData, tokens) => {
    // 1. 상태 업데이트
    setUser(userData); 
    // 2. 로컬 스토리지에 저장 (새로고침 대비)
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };
  
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    
    setUser(null);
    setCurrentView('home');
    alert('로그아웃 되었습니다.');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'home': return <MainPage onNavigate={setCurrentView} user={user} />;
      case 'login': return <LoginPage onNavigate={setCurrentView} onLogin={handleLoginSuccess} />;
      case 'signup': return <SignupPage onNavigate={setCurrentView} />;
      case 'profile': return <ProfilePage user={user} onNavigate={setCurrentView} />;
      case 'recommend': return <RecommendPage user={user} onNavigate={setCurrentView} />;
      default: return <MainPage onNavigate={setCurrentView} user={user} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans selection:bg-purple-500 selection:text-white overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/30 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-900/30 rounded-full blur-[100px]" />
      </div>

      <header className="w-full px-6 py-4 flex justify-between items-center backdrop-blur-sm border-b border-white/5 sticky top-0 z-50">
        <div onClick={() => setCurrentView('home')} className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
          <Film className="text-purple-500" />
          <span className="text-xl font-bold tracking-wider">Feelm</span>
        </div>

        <nav className="flex items-center gap-4 md:gap-6">
          {user ? (
            <>
              <span className="hidden md:inline text-gray-300 text-sm">
                <span className="text-purple-400 font-bold">{user.name}</span>님
              </span>
              <button 
                onClick={() => setCurrentView('profile')}
                className="flex items-center gap-1 text-sm md:text-base px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-full transition-all"
              >
                <User size={18} />
                <span>프로필</span>
              </button>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-1 text-sm md:text-base text-gray-400 hover:text-white transition-colors"
              >
                <LogOut size={18} />
                <span className="hidden md:inline">로그아웃</span>
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => setCurrentView('login')}
                className="flex items-center gap-1 text-sm md:text-base text-gray-300 hover:text-white transition-colors"
              >
                <LogIn size={18} />
                <span className="hidden md:inline">로그인</span>
              </button>
              <button 
                onClick={() => setCurrentView('signup')}
                className="flex items-center gap-1 text-sm md:text-base text-gray-300 hover:text-white transition-colors"
              >
                <UserPlus size={18} />
                <span className="hidden md:inline">회원가입</span>
              </button>
            </>
          )}
        </nav>
      </header>

      <main className="container mx-auto px-4 py-8">
        {renderContent()}
      </main>

      <footer className="w-full py-6 text-center text-gray-600 text-sm mt-auto absolute bottom-0">
        &copy; 2024 Feelm Project. All rights reserved.
      </footer>
    </div>
  );
}