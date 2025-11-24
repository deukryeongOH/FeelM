import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

const FindPasswordForm = ({ onCancel }) => {
  const [step, setStep] = useState(1); // 1: Recover(발급), 2: Reset(변경)
  const [isLoading, setIsLoading] = useState(false);

  // Step 1 데이터
  const [recoverData, setRecoverData] = useState({ accountId: '', email: '' });
  // Step 2 데이터
  const [resetData, setResetData] = useState({ tempPwd: '', changePwd: '' });

  const handleRecoverChange = (e) => setRecoverData({ ...recoverData, [e.target.name]: e.target.value });
  const handleResetChange = (e) => setResetData({ ...resetData, [e.target.name]: e.target.value });

  // 1단계: 임시 비밀번호 발급 요청
  const handleRecoverSubmit = async (e) => {
    e.preventDefault();
    if (!recoverData.accountId || !recoverData.email) return alert('정보를 모두 입력해주세요.');
    
    setIsLoading(true);
    try {
      const query = `accountId=${encodeURIComponent(recoverData.accountId)}&email=${encodeURIComponent(recoverData.email)}`;
      const response = await fetch(`http://localhost:8080/recover-password?${query}`, {
        method: 'POST',
      });

      if (response.ok) {
        const tempPwd = await response.text();
        alert(`임시 비밀번호가 발급되었습니다: [ ${tempPwd} ]\n비밀번호를 변경해주세요.`);
        
        // 발급받은 임시 비밀번호를 다음 단계 state에 미리 세팅해두면 UX가 좋습니다.
        setResetData(prev => ({ ...prev, tempPwd: tempPwd })); 
        setStep(2);
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

  // 2단계: 비밀번호 재설정 요청
  const handleResetSubmit = async (e) => {
    e.preventDefault();
    if (!resetData.tempPwd || !resetData.changePwd) return alert('모든 정보를 입력해주세요.');
    
    setIsLoading(true);
    try {
      const query = `accountId=${encodeURIComponent(recoverData.accountId)}&tempPwd=${encodeURIComponent(resetData.tempPwd)}&changePwd=${encodeURIComponent(resetData.changePwd)}`;
      const response = await fetch(`http://localhost:8080/reset-password?${query}`, {
        method: 'POST',
      });

      if (response.ok) {
        alert('비밀번호가 성공적으로 변경되었습니다. 로그인해주세요.');
        onCancel(); // 로그인 화면으로 복귀
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
    <div className="animate-fade-in">
      {step === 1 && (
        <form onSubmit={handleRecoverSubmit} className="space-y-4">
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

      {step === 2 && (
        <form onSubmit={handleResetSubmit} className="space-y-4 animate-fade-in">
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
      
      <button 
        type="button" 
        onClick={onCancel} 
        className="w-full py-2 mt-2 text-gray-400 hover:text-white flex items-center justify-center gap-2 transition-colors"
      >
        <ArrowLeft size={16} /> 로그인으로 돌아가기
      </button>
    </div>
  );
};

export default FindPasswordForm;