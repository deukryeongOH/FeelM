import React, { useState } from 'react';

const LoginForm = ({ onLogin, onNavigate, onChangeView }) => {
  const [credentials, setCredentials] = useState({ accountId: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!credentials.accountId || !credentials.password) return alert('정보를 입력해주세요.');

    setIsLoading(true);
    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        const data = await response.json();
        onLogin(data);
        alert(`${data.name}님 환영합니다!`);
        onNavigate('home');
      } else {
        alert('로그인 실패: 아이디 혹은 비밀번호를 확인해주세요.');
      }
    } catch (error) {
      console.error(error);
      alert('서버 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
      <div>
        <label className="block text-sm text-gray-400 mb-1">아이디</label>
        <input 
          type="text" 
          name="accountId" 
          value={credentials.accountId} 
          onChange={handleChange} 
          placeholder="아이디를 입력하세요" 
          className="w-full p-3 bg-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500" 
        />
      </div>
      <div>
        <label className="block text-sm text-gray-400 mb-1">비밀번호</label>
        <input 
          type="password" 
          name="password" 
          value={credentials.password} 
          onChange={handleChange} 
          placeholder="비밀번호를 입력하세요" 
          className="w-full p-3 bg-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500" 
        />
      </div>
      <button 
        type="submit" 
        disabled={isLoading} 
        className={`w-full py-3 mt-4 rounded font-bold transition-colors ${isLoading ? 'bg-gray-600' : 'bg-purple-600 hover:bg-purple-700'}`}
      >
        {isLoading ? '로그인 중...' : '로그인 하기'}
      </button>

      <div className="flex items-center justify-center gap-4 mt-4 text-sm text-gray-400">
        <button type="button" onClick={() => onChangeView('findId')} className="hover:text-white hover:underline">아이디 찾기</button>
        <span className="text-gray-600">|</span>
        <button type="button" onClick={() => onChangeView('findPw')} className="hover:text-white hover:underline">비밀번호 찾기</button>
      </div>
    </form>
  );
};

export default LoginForm;