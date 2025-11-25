import React, { useState } from 'react';

const SignupPage = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    email: '',
    accountId: '',
    password: '',
    confirmPassword: ''
  });
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const nextFormData = { ...formData, [name]: value };
    setFormData(nextFormData);

    if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setEmailError(value.length > 0 && !emailRegex.test(value) ? '형식이 맞지 않습니다' : '');
    }

    if (name === 'password' || name === 'confirmPassword') {
      setPasswordError(nextFormData.confirmPassword && nextFormData.password !== nextFormData.confirmPassword ? '비밀번호가 일치하지 않습니다' : '');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (passwordError || emailError || !formData.name || !formData.age || !formData.accountId || !formData.password) {
      alert('입력 정보를 확인해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      const requestBody = {
        name: formData.name,
        age: parseInt(formData.age, 10),
        email: formData.email,
        accountId: formData.accountId,
        password: formData.password
      };

      const response = await fetch('http://localhost:8080/api/user/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const joinedName = await response.text(); 
        alert(`${joinedName}님, 회원가입이 완료되었습니다!`);
        if (onNavigate) onNavigate('login'); 
      } else {
        const errorMsg = await response.text();
        alert(`회원가입 실패: ${errorMsg || '서버 오류'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('서버 연결 실패');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-white py-10">
      <h2 className="text-3xl font-bold mb-6">회원가입</h2>
      <div className="w-full max-w-md p-8 bg-gray-800 rounded-lg shadow-xl border border-gray-700">
        <form onSubmit={handleSubmit} className="space-y-4">
          {['name', 'age', 'email', 'accountId', 'password'].map(field => (
             <div key={field}>
              <label className="block text-sm text-gray-400 mb-1">{field === 'name' ? '이름' : field === 'age' ? '나이' : field === 'email' ? '이메일' : field === 'accountId' ? '계정 아이디' : '비밀번호'}</label>
              <div className="flex items-center gap-3">
                <input type={field === 'age' ? 'number' : field === 'password' ? 'password' : field === 'email' ? 'email' : 'text'} name={field} value={formData[field]} onChange={handleInputChange} placeholder={`${field} 입력`} className={`flex-1 p-3 bg-gray-700 rounded text-white focus:outline-none focus:ring-2 ${field === 'email' && emailError ? 'ring-red-500' : 'focus:ring-purple-500'}`} />
                {field === 'email' && emailError && <span className="text-red-500 text-sm animate-pulse">{emailError}</span>}
              </div>
            </div>
          ))}
          <div>
            <label className="block text-sm text-gray-400 mb-1">비밀번호 확인</label>
            <div className="flex items-center gap-3">
              <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} placeholder="비밀번호 확인" className={`flex-1 p-3 bg-gray-700 rounded text-white focus:outline-none focus:ring-2 ${passwordError ? 'ring-red-500' : 'focus:ring-purple-500'}`} />
              {passwordError && <span className="text-red-500 text-sm animate-pulse">{passwordError}</span>}
            </div>
          </div>
          <button type="submit" disabled={isLoading} className={`w-full py-3 mt-4 rounded font-bold transition-colors ${isLoading ? 'bg-gray-600' : 'bg-purple-600 hover:bg-purple-700'}`}>{isLoading ? '가입 처리 중...' : '가입하기'}</button>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;