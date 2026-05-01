// import React, { useState, useEffect } from 'react';
// import { ArrowLeft } from 'lucide-react';
//
// const LoginPage = ({ onNavigate, onLogin }) => {
//   const [view, setView] = useState('login');
//   const [isLoading, setIsLoading] = useState(false);
//
//   const [credentials, setCredentials] = useState({ accountId: '', password: '' });
//   const [findEmail, setFindEmail] = useState('');
//   const [findPwStep, setFindPwStep] = useState(1);
//   const [recoverData, setRecoverData] = useState({ accountId: '', email: '' });
//   const [resetData, setResetData] = useState({ tempPwd: '', changePwd: '' });
//
//   const handleCredentialsChange = (e) => setCredentials({ ...credentials, [e.target.name]: e.target.value });
//   const handleRecoverChange = (e) => setRecoverData({ ...recoverData, [e.target.name]: e.target.value });
//   const handleResetChange = (e) => setResetData({ ...resetData, [e.target.name]: e.target.value });
//
//   const handleLoginSubmit = async (e) => {
//     e.preventDefault();
//     if (!credentials.accountId || !credentials.password) return alert('정보를 입력해주세요.');
//
//     setIsLoading(true);
//     try {
//       const response = await fetch('/api/user/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(credentials),
//       });
//
//       if (response.ok) {
//         const data = await response.json();
//
//         const tokens = {
//             accessToken: data.accessToken,
//             refreshToken: data.refreshToken
//         };
//
//         const userData = {
//             id: data.id,
//             accountId: data.accountId,
//             name: data.name,
//             email: data.email,
//             age: data.age
//         };
//
//         onLogin(userData, tokens);
//         alert(`${data.name}님 환영합니다!`);
//         onNavigate('home');
//       } else {
//         alert('로그인 실패: 아이디 혹은 비밀번호를 확인해주세요.');
//       }
//     } catch (error) {
//       console.error(error);
//       alert('서버 오류가 발생했습니다.');
//     } finally {
//       setIsLoading(false);
//     }
//   };
//
//   const handleFindIdSubmit = async (e) => {
//     e.preventDefault();
//     if (!findEmail) return alert('이메일을 입력해주세요.');
//     setIsLoading(true);
//     try {
//       const response = await fetch('http://localhost:8080/api/user/findId', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email: findEmail })
//       });
//
//       if (response.ok) {
//         const accountId = await response.text();
//         alert(`회원님의 아이디는 [ ${accountId} ] 입니다.`);
//         setView('login');
//       } else {
//         alert('해당 이메일로 가입된 정보를 찾을 수 없습니다.');
//       }
//     } catch (error) {
//       console.error(error);
//       alert('서버 오류가 발생했습니다.');
//     } finally {
//       setIsLoading(false);
//     }
//   };
//
//   const handleRecoverPwdSubmit = async (e) => {
//     e.preventDefault();
//     if (!recoverData.accountId || !recoverData.email) return alert('정보를 모두 입력해주세요.');
//     setIsLoading(true);
//     try {
//       const response = await fetch('http://localhost:8080/api/user/recover-password', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email: recoverData.email, accountId: recoverData.accountId})
//       });
//
//       if (response.ok) {
//         const tempPwd = await response.text();
//         alert(`임시 비밀번호가 발급되었습니다: [ ${tempPwd} ]\n비밀번호를 변경해주세요.`);
//         setResetData(prev => ({ ...prev, tempPwd: tempPwd }));
//         setFindPwStep(2);
//       } else {
//         alert('일치하는 계정 정보를 찾을 수 없습니다.');
//       }
//     } catch (error) {
//       console.error(error);
//       alert('서버 오류가 발생했습니다.');
//     } finally {
//       setIsLoading(false);
//     }
//   };
//
//   const handleResetPwdSubmit = async (e) => {
//     e.preventDefault();
//     if (!resetData.tempPwd || !resetData.changePwd) return alert('모든 정보를 입력해주세요.');
//     setIsLoading(true);
//     try {
//       const response = await fetch('/api/user/reset-password', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ accountId: recoverData.accountId, tempPwd: resetData.tempPwd, changePwd: resetData.changePwd})
//       });
//
//       if (response.ok) {
//         alert('비밀번호가 성공적으로 변경되었습니다. 로그인해주세요.');
//         setView('login');
//         setFindPwStep(1);
//         setRecoverData({ accountId: '', email: '' });
//         setResetData({ tempPwd: '', changePwd: '' });
//       } else {
//         alert('비밀번호 변경에 실패했습니다. 임시 비밀번호를 다시 확인해주세요.');
//       }
//     } catch (error) {
//       console.error(error);
//       alert('서버 오류가 발생했습니다.');
//     } finally {
//       setIsLoading(false);
//     }
//   };
//
//   useEffect(() => {
//       const params = new URLSearchParams(window.location.search);
//       const error = params.get('error');
//       const msg = params.get('message');
//       if(error && msg){
//           alert(decodeURIComponent(msg));
//       }
//   }, []);
//
//   const SocialButton = ({ provider, color, text }) => (
//       <a
//       href={`http://localhost:8080/oauth2/authorization/${provider}`}
//       className={`w-full py-3 flex items-center justify-center gap-2 rounded font-bold text-white transition-all ${color} hover:opacity-90 mb-2`}
//     >
//       {text} 로그인
//     </a>
//   );
//
//   return (
//     <div className="flex flex-col items-center justify-center min-h-[60vh] text-white">
//       <h2 className="text-3xl font-bold mb-4">
//         {view === 'login' ? '로그인' : view === 'findId' ? '아이디 찾기' : '비밀번호 찾기'}
//       </h2>
//
//       <div className="w-full max-w-md p-8 bg-gray-800 rounded-lg shadow-xl border border-gray-700 transition-all duration-300">
//
//         {view === 'login' && (
//           <>
//           <form onSubmit={handleLoginSubmit} className="space-y-4">
//             <div>
//               <label className="block text-sm text-gray-400 mb-1">아이디</label>
//               <input type="text" name="accountId" value={credentials.accountId} onChange={handleCredentialsChange} placeholder="아이디를 입력하세요" className="w-full p-3 bg-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
//             </div>
//             <div>
//               <label className="block text-sm text-gray-400 mb-1">비밀번호</label>
//               <input type="password" name="password" value={credentials.password} onChange={handleCredentialsChange} placeholder="비밀번호를 입력하세요" className="w-full p-3 bg-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
//             </div>
//             <button type="submit" disabled={isLoading} className={`w-full py-3 mt-4 rounded font-bold transition-colors ${isLoading ? 'bg-gray-600' : 'bg-purple-600 hover:bg-purple-700'}`}>{isLoading ? '로그인 중...' : '로그인 하기'}</button>
//
//             <div className="mb-6 space-y-2">
//               <SocialButton provider="google" color="bg-red-600" text="Google" />
//               <SocialButton provider="kakao" color="bg-yellow-500 !text-black" text="Kakao" />
//               <SocialButton provider="naver" color="bg-green-600" text="Naver" />
//               <div className="flex items-center gap-2 my-4">
//                 <hr className="flex-1 border-gray-700" />
//                 <span className="text-xs text-gray-500 uppercase">또는</span>
//                 <hr className="flex-1 border-gray-700" />
//               </div>
//             </div>
//
//             <div className="flex items-center justify-center gap-4 mt-4 text-sm text-gray-400">
//               <button type="button" onClick={() => setView('findId')} className="hover:text-white hover:underline">아이디 찾기</button>
//               <span className="text-gray-600">|</span>
//               <button type="button" onClick={() => setView('findPw')} className="hover:text-white hover:underline">비밀번호 찾기</button>
//             </div>
//           </form>
//           </>
//         )}
//
//         {view === 'findId' && (
//           <form onSubmit={handleFindIdSubmit} className="space-y-4 animate-fade-in">
//             <p className="text-gray-400 text-sm mb-4">가입 시 등록한 이메일을 입력하시면 아이디를 알려드립니다.</p>
//             <div>
//               <label className="block text-sm text-gray-400 mb-1">이메일</label>
//               <input type="email" value={findEmail} onChange={(e) => setFindEmail(e.target.value)} placeholder="example@email.com" className="w-full p-3 bg-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
//             </div>
//             <button type="submit" disabled={isLoading} className={`w-full py-3 mt-4 rounded font-bold transition-colors ${isLoading ? 'bg-gray-600' : 'bg-purple-600 hover:bg-purple-700'}`}>{isLoading ? '찾기...' : '아이디 찾기'}</button>
//             <button type="button" onClick={() => setView('login')} className="w-full py-2 mt-2 text-gray-400 hover:text-white flex items-center justify-center gap-2 transition-colors"><ArrowLeft size={16} /> 로그인으로 돌아가기</button>
//           </form>
//         )}
//
//         {view === 'findPw' && (
//           <div className="animate-fade-in">
//             {findPwStep === 1 && (
//               <form onSubmit={handleRecoverPwdSubmit} className="space-y-4">
//                 <p className="text-gray-400 text-sm mb-4">계정 정보와 이메일을 입력하시면 임시 비밀번호를 발급해드립니다.</p>
//                 <div>
//                   <label className="block text-sm text-gray-400 mb-1">아이디</label>
//                   <input type="text" name="accountId" value={recoverData.accountId} onChange={handleRecoverChange} placeholder="아이디 입력" className="w-full p-3 bg-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
//                 </div>
//                 <div>
//                   <label className="block text-sm text-gray-400 mb-1">이메일</label>
//                   <input type="email" name="email" value={recoverData.email} onChange={handleRecoverChange} placeholder="이메일 입력" className="w-full p-3 bg-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
//                 </div>
//                 <button type="submit" disabled={isLoading} className={`w-full py-3 mt-4 rounded font-bold transition-colors ${isLoading ? 'bg-gray-600' : 'bg-purple-600 hover:bg-purple-700'}`}>{isLoading ? '처리 중...' : '임시 비밀번호 발급'}</button>
//               </form>
//             )}
//
//             {findPwStep === 2 && (
//               <form onSubmit={handleResetPwdSubmit} className="space-y-4">
//                 <p className="text-gray-400 text-sm mb-4">발급된 임시 비밀번호와 변경할 새 비밀번호를 입력해주세요.</p>
//                 <div>
//                   <label className="block text-sm text-gray-400 mb-1">임시 비밀번호</label>
//                   <input type="text" name="tempPwd" value={resetData.tempPwd} onChange={handleResetChange} placeholder="임시 비밀번호" className="w-full p-3 bg-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
//                 </div>
//                 <div>
//                   <label className="block text-sm text-gray-400 mb-1">새 비밀번호</label>
//                   <input type="password" name="changePwd" value={resetData.changePwd} onChange={handleResetChange} placeholder="새 비밀번호 입력" className="w-full p-3 bg-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
//                 </div>
//                 <button type="submit" disabled={isLoading} className={`w-full py-3 mt-4 rounded font-bold transition-colors ${isLoading ? 'bg-gray-600' : 'bg-purple-600 hover:bg-purple-700'}`}>{isLoading ? '변경 중...' : '비밀번호 변경하기'}</button>
//               </form>
//             )}
//             <button type="button" onClick={() => { setView('login'); setFindPwStep(1); }} className="w-full py-2 mt-2 text-gray-400 hover:text-white flex items-center justify-center gap-2 transition-colors"><ArrowLeft size={16} /> 로그인으로 돌아가기</button>
//           </div>
//         )}
//
//       </div>
//     </div>
//   );
// };
//
// export default LoginPage;



import React, { useState, useEffect } from 'react';
import { ArrowLeft, Mail, Lock, User } from 'lucide-react';

const SocialButton = ({ provider, bgColor, textColor, text, icon }) => (
  <a
    href={`http://15.164.52.45.nip.io/oauth2/authorization/${provider}`}
    className={`w-full py-3 px-4 flex items-center justify-center gap-3 rounded-xl font-semibold transition-all hover:opacity-90 active:scale-[0.98] mb-3 ${bgColor} ${textColor} shadow-md`}
  >
    {icon}
    <span>{text}로 계속하기</span>
  </a>
);

const LoginPage = ({ onNavigate, onLogin }) => {
  const [view, setView] = useState('login');
  const [isLoading, setIsLoading] = useState(false);
  const [credentials, setCredentials] = useState({ accountId: '', password: '' });

  // 비밀번호/아이디 찾기 관련 state (기존 유지)
  const [findEmail, setFindEmail] = useState('');
  const [findPwStep, setFindPwStep] = useState(1);
  const [recoverData, setRecoverData] = useState({ accountId: '', email: '' });
  const [resetData, setResetData] = useState({ tempPwd: '', changePwd: '' });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const error = params.get('error');
    const msg = params.get('message');
    if (error && msg) {
      alert(decodeURIComponent(msg));
    }
  }, []);

  const handleChange = (e) => setCredentials({ ...credentials, [e.target.name]: e.target.value });
  const handleRecoverChange = (e) => setRecoverData({ ...recoverData, [e.target.name]: e.target.value });
  const handleResetChange = (e) => setResetData({ ...resetData, [e.target.name]: e.target.value });

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!credentials.accountId || !credentials.password) return alert('정보를 입력해주세요.');
    setIsLoading(true);
    try {
      const response = await fetch('/api/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      if (response.ok) {
        const data = await response.json();
        onLogin(data, { accessToken: data.accessToken, refreshToken: data.refreshToken });
        alert('환영합니다. ' + data.name + '님');
        onNavigate('home');
      } else {
        alert('아이디 혹은 비밀번호를 확인해주세요.');
      }
    } catch (error) {
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
      const response = await fetch('/api/user/findId', { // 로컬 테스트용 상대경로 권장
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: findEmail })
      });
      if (response.ok) {
        const id = await response.text();
        alert(`회원님의 아이디는 [ ${id} ] 입니다.`);
        setView('login');
      } else {
        alert('해당 정보를 찾을 수 없습니다.');
      }
    } catch (error) {
      alert('서버 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecoverPwdSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch('/api/user/recover-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: recoverData.email, accountId: recoverData.accountId})
      });
      if (response.ok) {
        const tempPwd = await response.text();
        alert(`임시 비밀번호가 발급되었습니다: [ ${tempPwd} ]`);
        setResetData(prev => ({ ...prev, tempPwd: tempPwd }));
        setFindPwStep(2);
      } else {
        alert('일치하는 정보를 찾을 수 없습니다.');
      }
    } catch (error) {
      alert('서버 오류 발생');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPwdSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch('/api/user/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountId: recoverData.accountId, tempPwd: resetData.tempPwd, changePwd: resetData.changePwd})
      });
      if (response.ok) {
        alert('비밀번호가 변경되었습니다. 다시 로그인해주세요.');
        setView('login');
        setFindPwStep(1);
      } else {
        alert('변경에 실패했습니다.');
      }
    } catch (error) {
      alert('서버 오류 발생');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      {/* 제목 섹션 */}
      <div className="text-center mb-8">
        <h2 className="text-4xl font-extrabold tracking-tight text-white mb-2">로그인</h2>
        <p className="text-gray-400">Feelm에 오신 것을 환영합니다</p>
      </div>

      <div className="w-full max-w-md p-8 bg-[#1e232d] rounded-[2rem] shadow-2xl border border-white/5 backdrop-blur-lg">

        {view === 'login' && (
          <>
            {/* 일반 로그인 폼 */}
            <form onSubmit={handleLoginSubmit} className="space-y-5">
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-400 ml-1">아이디</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input
                    type="text" name="accountId" value={credentials.accountId} onChange={handleChange}
                    placeholder="아이디 또는 이메일"
                    className="w-full pl-12 pr-4 py-3.5 bg-[#12161f] rounded-xl text-white border border-gray-700 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder:text-gray-600"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-400 ml-1">비밀번호</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input
                    type="password" name="password" value={credentials.password} onChange={handleChange}
                    placeholder="비밀번호"
                    className="w-full pl-12 pr-4 py-3.5 bg-[#12161f] rounded-xl text-white border border-gray-700 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder:text-gray-600"
                  />
                </div>
              </div>

              <button
                type="submit" disabled={isLoading}
                className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-purple-900/20 transition-all active:scale-[0.99] disabled:opacity-50"
              >
                {isLoading ? '인증 중...' : '로그인'}
              </button>
            </form>

            {/* 구분선 */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-700"></div></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-[#1e232d] px-4 text-gray-500">또는</span></div>
            </div>

            {/* 소셜 로그인 섹션 */}
            <div className="flex flex-col">
              <SocialButton
                provider="google" bgColor="bg-white" textColor="text-gray-800" text="Google"
                icon={<img src="https://www.gstatic.com/images/branding/product/1x/googleg_48dp.png" className="w-5 h-5" alt="G" />}
              />
              <SocialButton
                provider="kakao" bgColor="bg-[#FEE500]" textColor="text-black" text="카카오"
                icon={<div className="w-5 h-5 bg-black rounded-full flex items-center justify-center text-[10px] text-[#FEE500] font-bold">K</div>}
              />
              <SocialButton
                provider="naver" bgColor="bg-[#03C75A]" textColor="text-white" text="네이버"
                icon={<div className="w-5 h-5 font-black text-lg">N</div>}
              />
            </div>

            {/* 하단 링크 */}
            <div className="mt-8 pt-6 border-t border-gray-700/50 flex flex-col items-center gap-4">
              <div className="flex gap-4 text-sm text-gray-500">
                <button onClick={() => setView('findId')} className="hover:text-white transition-colors">아이디 찾기</button>
                <span className="text-gray-700">|</span>
                <button onClick={() => setView('findPw')} className="hover:text-white transition-colors">비밀번호 찾기</button>
              </div>
              <p className="text-sm text-gray-400">
                계정이 없으신가요? <button onClick={() => onNavigate('signup')} className="text-purple-400 font-bold hover:underline">회원가입</button>
              </p>
            </div>
          </>
        )}

        {(view === 'findId' || view === 'findPw') && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <button
              onClick={() => { setView('login'); setFindPwStep(1); }}
              className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors group"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              <span>로그인으로 돌아가기</span>
            </button>

            {/* --- 아이디 찾기 폼 --- */}
            {view === 'findId' && (
              <form onSubmit={handleFindIdSubmit} className="space-y-5">
                <p className="text-gray-400 text-sm mb-2">가입 시 등록한 이메일을 입력해주세요.</p>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input
                    type="email" value={findEmail} onChange={(e) => setFindEmail(e.target.value)}
                    placeholder="example@email.com"
                    className="w-full pl-12 pr-4 py-3.5 bg-[#12161f] rounded-xl text-white border border-gray-700 focus:outline-none focus:border-purple-500 transition-all"
                  />
                </div>
                <button type="submit" className="w-full py-4 bg-purple-600 hover:bg-purple-500 rounded-xl font-bold shadow-lg transition-all">
                  아이디 찾기
                </button>
              </form>
            )}

            {/* --- 비밀번호 찾기 폼 --- */}
            {view === 'findPw' && (
              <>
                {findPwStep === 1 ? (
                  <form onSubmit={handleRecoverPwdSubmit} className="space-y-5">
                    <p className="text-gray-400 text-sm mb-2">계정 아이디와 이메일을 입력해주세요.</p>
                    <input
                      type="text" name="accountId" value={recoverData.accountId} onChange={handleRecoverChange}
                      placeholder="아이디" className="w-full px-4 py-3.5 bg-[#12161f] rounded-xl text-white border border-gray-700 focus:outline-none focus:border-purple-500"
                    />
                    <input
                      type="email" name="email" value={recoverData.email} onChange={handleRecoverChange}
                      placeholder="이메일" className="w-full px-4 py-3.5 bg-[#12161f] rounded-xl text-white border border-gray-700 focus:outline-none focus:border-purple-500"
                    />
                    <button type="submit" className="w-full py-4 bg-purple-600 hover:bg-purple-500 rounded-xl font-bold shadow-lg transition-all">
                      임시 비밀번호 발급
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleResetPwdSubmit} className="space-y-5">
                    <p className="text-gray-400 text-sm mb-2">임시 비밀번호와 새 비밀번호를 입력해주세요.</p>
                    <input
                      type="text" name="tempPwd" value={resetData.tempPwd} onChange={handleResetChange}
                      placeholder="임시 비밀번호" className="w-full px-4 py-3.5 bg-[#12161f] rounded-xl text-white border border-gray-700 focus:outline-none focus:border-purple-500"
                    />
                    <input
                      type="password" name="changePwd" value={resetData.changePwd} onChange={handleResetChange}
                      placeholder="새 비밀번호" className="w-full px-4 py-3.5 bg-[#12161f] rounded-xl text-white border border-gray-700 focus:outline-none focus:border-purple-500"
                    />
                    <button type="submit" className="w-full py-4 bg-purple-600 hover:bg-purple-500 rounded-xl font-bold shadow-lg transition-all">
                      비밀번호 변경하기
                    </button>
                  </form>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;