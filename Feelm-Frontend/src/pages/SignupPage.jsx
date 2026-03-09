import React, { useState } from 'react';

const SignupPage = ({ onNavigate }) => {
  // [수정] 나이(age) 대신 생년월일(birthDate) 관련 상태 추가
  const [formData, setFormData] = useState({
    name: '',
    birthYear: '',
    birthMonth: '',
    birthDay: '',
    email: '',
    accountId: '',
    password: '',
    confirmPassword: ''
  });
  
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // [수정] 년, 월, 일 옵션 생성을 위한 데이터
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i); // 올해부터 100년 전까지
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

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

  // [수정] 만 나이 계산 함수
  const calculateAge = (year, month, day) => {
    const today = new Date();
    const birthDate = new Date(year, month - 1, day);
    
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    
    // 생일이 아직 지나지 않았으면 1살 뺌
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // [수정] 생년월일 유효성 검사 추가
    if (passwordError || emailError || !formData.name || !formData.birthYear || !formData.birthMonth || !formData.birthDay || !formData.accountId || !formData.password) {
      alert('모든 정보를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      // [수정] 전송 시점에서 나이 계산하여 payload 생성
      const calculatedAge = calculateAge(formData.birthYear, formData.birthMonth, formData.birthDay);

      const requestBody = {
        name: formData.name,
        age: calculatedAge, // 계산된 나이 전송
        email: formData.email,
        accountId: formData.accountId,
        password: formData.password
      };

      const response = await fetch('/api/user/join', {
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
          
          {/* 1. 이름 입력 */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">이름</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleInputChange} 
              placeholder="이름 입력" 
              className="w-full p-3 bg-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500" 
            />
          </div>

          {/* [수정] 2. 생년월일 선택 (스크롤 가능한 Select Box) */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">생년월일</label>
            <div className="flex gap-2">
              {/* 연도 선택 */}
              <select 
                name="birthYear" 
                value={formData.birthYear} 
                onChange={handleInputChange}
                className="flex-1 p-3 bg-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer scrollbar-thin scrollbar-thumb-gray-600"
              >
                <option value="">년</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>

              {/* 월 선택 */}
              <select 
                name="birthMonth" 
                value={formData.birthMonth} 
                onChange={handleInputChange}
                className="flex-1 p-3 bg-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
              >
                <option value="">월</option>
                {months.map(month => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>

              {/* 일 선택 */}
              <select 
                name="birthDay" 
                value={formData.birthDay} 
                onChange={handleInputChange}
                className="flex-1 p-3 bg-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
              >
                <option value="">일</option>
                {days.map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </div>
          </div>

          {/* 3. 나머지 필드들 (map으로 처리하던 부분을 명시적으로 분리) */}
          {['email', 'accountId', 'password'].map(field => (
             <div key={field}>
              <label className="block text-sm text-gray-400 mb-1">
                {field === 'email' ? '이메일' : field === 'accountId' ? '계정 아이디' : '비밀번호'}
              </label>
              <div className="flex items-center gap-3">
                <input 
                  type={field === 'password' ? 'password' : field === 'email' ? 'email' : 'text'} 
                  name={field} 
                  value={formData[field]} 
                  onChange={handleInputChange} 
                  placeholder={`${field === 'email' ? '이메일' : field === 'accountId' ? '아이디' : '비밀번호'} 입력`} 
                  className={`flex-1 p-3 bg-gray-700 rounded text-white focus:outline-none focus:ring-2 ${field === 'email' && emailError ? 'ring-red-500' : 'focus:ring-purple-500'}`} 
                />
                {field === 'email' && emailError && <span className="text-red-500 text-sm animate-pulse whitespace-nowrap">{emailError}</span>}
              </div>
            </div>
          ))}

          {/* 4. 비밀번호 확인 */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">비밀번호 확인</label>
            <div className="flex items-center gap-3">
              <input 
                type="password" 
                name="confirmPassword" 
                value={formData.confirmPassword} 
                onChange={handleInputChange} 
                placeholder="비밀번호 확인" 
                className={`flex-1 p-3 bg-gray-700 rounded text-white focus:outline-none focus:ring-2 ${passwordError ? 'ring-red-500' : 'focus:ring-purple-500'}`} 
              />
              {passwordError && <span className="text-red-500 text-sm animate-pulse whitespace-nowrap">{passwordError}</span>}
            </div>
          </div>

          <button type="submit" disabled={isLoading} className={`w-full py-3 mt-4 rounded font-bold transition-colors ${isLoading ? 'bg-gray-600' : 'bg-purple-600 hover:bg-purple-700'}`}>{isLoading ? '가입 처리 중...' : '가입하기'}</button>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;