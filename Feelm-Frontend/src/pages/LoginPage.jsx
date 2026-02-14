import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

const LoginPage = ({ onNavigate, onLogin }) => {
  const [view, setView] = useState('login');
  const [isLoading, setIsLoading] = useState(false);
  
  const [credentials, setCredentials] = useState({ accountId: '', password: '' });
  const [findEmail, setFindEmail] = useState('');
  const [findPwStep, setFindPwStep] = useState(1);
  const [recoverData, setRecoverData] = useState({ accountId: '', email: '' });
  const [resetData, setResetData] = useState({ tempPwd: '', changePwd: '' });

  const handleCredentialsChange = (e) => setCredentials({ ...credentials, [e.target.name]: e.target.value });
  const handleRecoverChange = (e) => setRecoverData({ ...recoverData, [e.target.name]: e.target.value });
  const handleResetChange = (e) => setResetData({ ...resetData, [e.target.name]: e.target.value });

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!credentials.accountId || !credentials.password) return alert('정보를 입력해주세요.');

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        const data = await response.json();

        const tokens = {
            accessToken: data.accessToken,
            refreshToken: data.refreshToken
        };

        const userData = {
            id: data.id,
            accountId: data.accountId,
            name: data.name,
            email: data.email,
            age: data.age
        };

        onLogin(userData, tokens);
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

  const handleFindIdSubmit = async (e) => {
    e.preventDefault();
    if (!findEmail) return alert('이메일을 입력해주세요.');
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/user/findId', {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: findEmail })
      });

      if (response.ok) {
        const accountId = await response.text();
        alert(`회원님의 아이디는 [ ${accountId} ] 입니다.`);
        setView('login');
      } else {
        alert('해당 이메일로 가입된 정보를 찾을 수 없습니다.');
      }
    } catch (error) {
      console.error(error);
      alert('서버 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecoverPwdSubmit = async (e) => {
    e.preventDefault();
    if (!recoverData.accountId || !recoverData.email) return alert('정보를 모두 입력해주세요.');
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/user/recover-password', {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: recoverData.email, accountId: recoverData.accountId})
      });

      if (response.ok) {
        const tempPwd = await response.text();
        alert(`임시 비밀번호가 발급되었습니다: [ ${tempPwd} ]\n비밀번호를 변경해주세요.`);
        setResetData(prev => ({ ...prev, tempPwd: tempPwd })); 
        setFindPwStep(2);
      } else {
        alert('일치하는 계정 정보를 찾을 수 없습니다.');
      }
    } catch (error) {
      console.error(error);
      alert('서버 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPwdSubmit = async (e) => {
    e.preventDefault();
    if (!resetData.tempPwd || !resetData.changePwd) return alert('모든 정보를 입력해주세요.');
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/user/reset-password', {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountId: recoverData.accountId, tempPwd: resetData.tempPwd, changePwd: resetData.changePwd})
      });

      if (response.ok) {
        alert('비밀번호가 성공적으로 변경되었습니다. 로그인해주세요.');
        setView('login');
        setFindPwStep(1);
        setRecoverData({ accountId: '', email: '' });
        setResetData({ tempPwd: '', changePwd: '' });
      } else {
        alert('비밀번호 변경에 실패했습니다. 임시 비밀번호를 다시 확인해주세요.');
      }
    } catch (error) {
      console.error(error);
      alert('서버 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-white">
      <h2 className="text-3xl font-bold mb-4">
        {view === 'login' ? '로그인' : view === 'findId' ? '아이디 찾기' : '비밀번호 찾기'}
      </h2>
      
      <div className="w-full max-w-md p-8 bg-gray-800 rounded-lg shadow-xl border border-gray-700 transition-all duration-300">
        
        {view === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">아이디</label>
              <input type="text" name="accountId" value={credentials.accountId} onChange={handleCredentialsChange} placeholder="아이디를 입력하세요" className="w-full p-3 bg-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">비밀번호</label>
              <input type="password" name="password" value={credentials.password} onChange={handleCredentialsChange} placeholder="비밀번호를 입력하세요" className="w-full p-3 bg-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
            <button type="submit" disabled={isLoading} className={`w-full py-3 mt-4 rounded font-bold transition-colors ${isLoading ? 'bg-gray-600' : 'bg-purple-600 hover:bg-purple-700'}`}>{isLoading ? '로그인 중...' : '로그인 하기'}</button>

            <div className="flex items-center justify-center gap-4 mt-4 text-sm text-gray-400">
              <button type="button" onClick={() => setView('findId')} className="hover:text-white hover:underline">아이디 찾기</button>
              <span className="text-gray-600">|</span>
              <button type="button" onClick={() => setView('findPw')} className="hover:text-white hover:underline">비밀번호 찾기</button>
            </div>
          </form>
        )}

        {view === 'findId' && (
          <form onSubmit={handleFindIdSubmit} className="space-y-4 animate-fade-in">
            <p className="text-gray-400 text-sm mb-4">가입 시 등록한 이메일을 입력하시면 아이디를 알려드립니다.</p>
            <div>
              <label className="block text-sm text-gray-400 mb-1">이메일</label>
              <input type="email" value={findEmail} onChange={(e) => setFindEmail(e.target.value)} placeholder="example@email.com" className="w-full p-3 bg-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
            <button type="submit" disabled={isLoading} className={`w-full py-3 mt-4 rounded font-bold transition-colors ${isLoading ? 'bg-gray-600' : 'bg-purple-600 hover:bg-purple-700'}`}>{isLoading ? '찾기...' : '아이디 찾기'}</button>
            <button type="button" onClick={() => setView('login')} className="w-full py-2 mt-2 text-gray-400 hover:text-white flex items-center justify-center gap-2 transition-colors"><ArrowLeft size={16} /> 로그인으로 돌아가기</button>
          </form>
        )}

        {view === 'findPw' && (
          <div className="animate-fade-in">
            {findPwStep === 1 && (
              <form onSubmit={handleRecoverPwdSubmit} className="space-y-4">
                <p className="text-gray-400 text-sm mb-4">계정 정보와 이메일을 입력하시면 임시 비밀번호를 발급해드립니다.</p>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">아이디</label>
                  <input type="text" name="accountId" value={recoverData.accountId} onChange={handleRecoverChange} placeholder="아이디 입력" className="w-full p-3 bg-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">이메일</label>
                  <input type="email" name="email" value={recoverData.email} onChange={handleRecoverChange} placeholder="이메일 입력" className="w-full p-3 bg-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                </div>
                <button type="submit" disabled={isLoading} className={`w-full py-3 mt-4 rounded font-bold transition-colors ${isLoading ? 'bg-gray-600' : 'bg-purple-600 hover:bg-purple-700'}`}>{isLoading ? '처리 중...' : '임시 비밀번호 발급'}</button>
              </form>
            )}

            {findPwStep === 2 && (
              <form onSubmit={handleResetPwdSubmit} className="space-y-4">
                <p className="text-gray-400 text-sm mb-4">발급된 임시 비밀번호와 변경할 새 비밀번호를 입력해주세요.</p>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">임시 비밀번호</label>
                  <input type="text" name="tempPwd" value={resetData.tempPwd} onChange={handleResetChange} placeholder="임시 비밀번호" className="w-full p-3 bg-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">새 비밀번호</label>
                  <input type="password" name="changePwd" value={resetData.changePwd} onChange={handleResetChange} placeholder="새 비밀번호 입력" className="w-full p-3 bg-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                </div>
                <button type="submit" disabled={isLoading} className={`w-full py-3 mt-4 rounded font-bold transition-colors ${isLoading ? 'bg-gray-600' : 'bg-purple-600 hover:bg-purple-700'}`}>{isLoading ? '변경 중...' : '비밀번호 변경하기'}</button>
              </form>
            )}
            <button type="button" onClick={() => { setView('login'); setFindPwStep(1); }} className="w-full py-2 mt-2 text-gray-400 hover:text-white flex items-center justify-center gap-2 transition-colors"><ArrowLeft size={16} /> 로그인으로 돌아가기</button>
          </div>
        )}

      </div>
    </div>
  );
};

export default LoginPage;