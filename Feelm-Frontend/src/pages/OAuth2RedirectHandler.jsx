import React, { useEffect } from 'react';

const OAuth2RedirectHandler = ({ onLogin, onNavigate }) => {
  useEffect(() => {
    // 1. URL 파라미터에서 accessToken과 refreshToken 추출
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('accessToken');
    const refreshToken = params.get('refreshToken');

    if (accessToken && refreshToken) {
      // 2. 토큰 저장 및 로그인 상태 업데이트
      // (지금은 유저 정보를 모르니 이름만 임시로 넣습니다)
      const userData = { name: '소셜 로그인 사용자' };
      const tokens = { accessToken, refreshToken };

      onLogin(userData, tokens);
      onNavigate('home'); // 홈으로 이동
    } else {
      alert('로그인에 실패했습니다.');
      onNavigate('login');
    }
  }, [onLogin, onNavigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-white">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-purple-500 mb-4"></div>
      <p>로그인 정보를 확인하고 있습니다...</p>
    </div>
  );
};

export default OAuth2RedirectHandler;