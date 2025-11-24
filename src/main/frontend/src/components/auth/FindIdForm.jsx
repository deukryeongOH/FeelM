import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

const FindIdForm = ({ onCancel }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return alert('이메일을 입력해주세요.');
    
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/user/findId', {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email })
      });

      if (response.ok) {
        const accountId = await response.text();
        alert(`회원님의 아이디는 [ ${accountId} ] 입니다.`);
        onCancel(); // 성공 시 로그인 화면으로 복귀
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
    <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
      <p className="text-gray-400 text-sm mb-4">가입 시 등록한 이메일을 입력하시면 아이디를 알려드립니다.</p>
      <div>
        <label className="block text-sm text-gray-400 mb-1">이메일</label>
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          placeholder="example@email.com" 
          className="w-full p-3 bg-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500" 
        />
      </div>
      <button 
        type="submit" 
        disabled={isLoading} 
        className={`w-full py-3 mt-4 rounded font-bold transition-colors ${isLoading ? 'bg-gray-600' : 'bg-purple-600 hover:bg-purple-700'}`}
      >
        {isLoading ? '찾기...' : '아이디 찾기'}
      </button>
      <button 
        type="button" 
        onClick={onCancel} 
        className="w-full py-2 mt-2 text-gray-400 hover:text-white flex items-center justify-center gap-2 transition-colors"
      >
        <ArrowLeft size={16} /> 로그인으로 돌아가기
      </button>
    </form>
  );
};

export default FindIdForm;