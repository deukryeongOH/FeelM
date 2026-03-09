import React, { useState } from 'react';
import { User, Key, CheckCircle, ArrowLeft } from 'lucide-react';

const ResetPasswordPage = ({ onNavigate, initialData }) => {
  const [data, setData] = useState({
    accountId: initialData?.accountId || '',
    tempPwd: initialData?.tempPwd || '',
    changePwd: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => setData({ ...data, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!data.accountId || !data.tempPwd || !data.changePwd) return alert('모든 정보를 입력해주세요.');

    setIsLoading(true);
    try {
      const query = `accountId=${encodeURIComponent(data.accountId)}&tempPwd=${encodeURIComponent(data.tempPwd)}&changePwd=${encodeURIComponent(data.changePwd)}`;
      const response = await fetch(`/api/user/reset-password?${query}`, { method: 'POST' });

      if (response.ok) {
        alert('비밀번호가 성공적으로 변경되었습니다.\n새 비밀번호로 로그인해주세요.');
        onNavigate('login');
      } else {
        alert('비밀번호 변경 실패. 임시 비밀번호를 다시 확인해주세요.');
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
      <h2 className="text-2xl font-bold mb-2 text-center text-white">비밀번호 변경</h2>
      <p className="text-gray-400 text-sm mb-6 text-center">발급받은 임시 비밀번호와 새 비밀번호를 입력하세요.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 아이디 */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">아이디</label>
          <div className="relative">
            <User className="absolute left-3 top-3 text-gray-500" size={20} />
            <input
              type="text"
              name="accountId"
              value={data.accountId}
              onChange={handleChange}
              placeholder="아이디"
              className="w-full pl-10 p-3 bg-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">임시 비밀번호</label>
          <div className="relative">
            <Key className="absolute left-3 top-3 text-gray-500" size={20} />
            <input
              type="text"
              name="tempPwd"
              value={data.tempPwd}
              onChange={handleChange}
              placeholder="임시 비밀번호 입력"
              className="w-full pl-10 p-3 bg-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">새 비밀번호</label>
          <div className="relative">
            <CheckCircle className="absolute left-3 top-3 text-gray-500" size={20} />
            <input
              type="password"
              name="changePwd"
              value={data.changePwd}
              onChange={handleChange}
              placeholder="변경할 비밀번호 입력"
              className="w-full pl-10 p-3 bg-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
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
          {isLoading ? '변경 중...' : '비밀번호 변경하기'}
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
export default ResetPasswordPage;