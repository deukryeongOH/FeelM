import React, { useState } from 'react';
import { User, Mail, ArrowLeft } from 'lucide-react';

const RecoverPasswordPage = ({ onNavigate }) => {
  const [data, setData] = useState({ accountId: '', email: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => setData({ ...data, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!data.accountId || !data.email) return alert('아이디와 이메일을 모두 입력해주세요.');

    setIsLoading(true);
    try {
      // 기존 방식 유지 (Query String)
      const query = `accountId=${encodeURIComponent(data.accountId)}&email=${encodeURIComponent(data.email)}`;
      const response = await fetch(`/api/user/recover-password?${query}`, { method: 'POST' });

      if (response.ok) {
        const tempPwd = await response.text();
        alert(`임시 비밀번호가 발급되었습니다.\n\n[ ${tempPwd} ]\n\n확인을 누르시면 비밀번호 변경 페이지로 이동합니다.`);
        // 비밀번호 재설정 페이지로 이동하면서 아이디와 임시비밀번호를 전달
        onNavigate('resetPw', { accountId: data.accountId, tempPwd: tempPwd });
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

  return (
    <div className="w-full max-w-md p-8 bg-gray-800 rounded-lg shadow-xl border border-gray-700 animate-fade-in">
      <h2 className="text-2xl font-bold mb-2 text-center text-white">비밀번호 찾기</h2>
      <p className="text-gray-400 text-sm mb-6 text-center">정보를 입력하시면 임시 비밀번호를 발급해드립니다.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">아이디</label>
          <div className="relative">
            <User className="absolute left-3 top-3 text-gray-500" size={20} />
            <input
              type="text"
              name="accountId"
              value={data.accountId}
              onChange={handleChange}
              placeholder="아이디 입력"
              className="w-full pl-10 p-3 bg-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">이메일</label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-500" size={20} />
            <input
              type="email"
              name="email"
              value={data.email}
              onChange={handleChange}
              placeholder="이메일 입력"
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
          {isLoading ? '처리 중...' : '임시 비밀번호 발급'}
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
export default RecoverPasswordPage;