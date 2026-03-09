import React, { useState } from 'react';
import { Mail, ArrowLeft } from 'lucide-react';


const FindIdPage = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return alert('이메일을 입력해주세요.');

    setIsLoading(true);
    try {
      // JSON Body 방식으로 전송하여 EOFException 방지
      const response = await fetch('/api/user/findId', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email })
      });

      if (response.ok) {
        const foundId = await response.text();
        alert(`회원님의 아이디는 [ ${foundId} ] 입니다.`);
        onNavigate('login');
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

  return (
    <div className="w-full max-w-md p-8 bg-gray-800 rounded-lg shadow-xl border border-gray-700 animate-fade-in">
      <h2 className="text-2xl font-bold mb-2 text-center text-white">아이디 찾기</h2>
      <p className="text-gray-400 text-sm mb-6 text-center">가입 시 등록한 이메일을 입력해주세요.</p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">이메일</label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-500" size={20} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              className="w-full pl-10 p-3 bg-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 mt-4 rounded font-bold text-white transition-colors ${
            isLoading ? 'bg-gray-600' : 'bg-purple-600 hover:bg-purple-700'
          }`}
        >
          {isLoading ? '확인 중...' : '아이디 찾기'}
        </button>
      </form>
      
      <button
        onClick={() => onNavigate('login')}
        className="w-full py-2 mt-4 text-gray-400 hover:text-white flex items-center justify-center gap-2 transition-colors"
      >
        <ArrowLeft size={16} /> 로그인으로 돌아가기
      </button>
    </div>
  );
};
export default FindIdPage;