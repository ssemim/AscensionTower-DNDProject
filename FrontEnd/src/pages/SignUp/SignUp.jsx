import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const hasEmoji = (str) => /\p{Emoji_Presentation}/u.test(str);

export default function SignUp() {
  const [ID, setID] = useState('');
  const [password, setPassword] = useState('');
  const [characterName, setCharacterName] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isFocused, setIsFocused] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    // 이모지 차단
    if (hasEmoji(ID) || hasEmoji(characterName)) {
      return setErrorMsg('이모지는 사용할 수 없습니다.');
    }

    // 비밀번호 확인
    if (password !== confirmPassword) {
      return setErrorMsg('비밀번호가 일치하지 않습니다.');
    }

    axios.post('http://localhost:8081/register', {
      id: ID,
      password,
      char_name: characterName,
      accessCode,
    }, { withCredentials: true })
      .then(res => {
        if (res.data.Status === 'Success') {
          navigate('/login'); // 가입 후 로그인 페이지로 이동
        } else {
          setErrorMsg(res.data.Error);
        }
      })
      .catch(() => setErrorMsg('서버 연결에 실패했습니다.'));
  };

  return (
    <div className="min-h-screen bg-main flex items-center justify-center font-nexon-warhaven">

      <div className="absolute inset-0 opacity-[0.05] bg-stark-grid bg-[length:40px_40px] pointer-events-none"></div>
      {/* Background HUD Grid Layout */}
      <div className="absolute inset-0 opacity-[0.05] dark:opacity-10 pointer-events-none"
        style={{ backgroundImage: 'linear-gradient(var(--color-primary) 1px, transparent 1px), linear-gradient(90deg, var(--color-primary) 1px, transparent 1px)', backgroundSize: '50px 50px' }}>
      </div>

      <div className="w-full max-w-md relative">

        <div className="relative bg-main/60 border border-border-primary/30 rounded-2xl p-12 backdrop-blur-sm shadow-stark-glow min-w-420px">

          {/* Top glow line */}
          <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_10px_var(--color-primary-glow)]"></div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-primary tracking-wider mb-2 filter drop-shadow-[0_0_15px_var(--color-primary-glow)]">
              회원가입
            </h1>
            <p className="text-xs text-primary/60 dark:text-white/60 tracking-widest">
              AUTHENTICATION REQUIRED
            </p>
            <div className="mt-4 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
          </div>

          {/* Sign Up Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* ID Field */}
            <div className="relative">
              <label className="block text-sm text-primary/80 dark:text-white/80 mb-2 tracking-wide">
                ID
              </label>
              <div className="relative group">
                <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300 ${isFocused === 'ID' ? 'text-primary filter drop-shadow-[0_0_8px_var(--color-primary-glow)]' : 'text-primary/50'}`}></div>
                <input
                  type="text"
                  value={ID}
                  onChange={(e) => setID(e.target.value)}
                  onFocus={() => setIsFocused('ID')}
                  onBlur={() => setIsFocused(null)}
                  className="w-full bg-white/90 border border-border-primary/30 rounded-lg pl-12 pr-4 py-3 text-black placeholder-gray-500 focus:outline-none focus:border-border-primary focus:shadow-stark-glow transition-all duration-300"
                  placeholder="ID"
                />
                <div className={`absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-primary/0 to-transparent pointer-events-none transition-all duration-500 ${isFocused === 'ID' ? 'via-primary/10' : ''}`}></div>
              </div>
            </div>

            {/* Character Name Field */}
            <div className="relative">
              <label className="block text-sm text-primary/80 dark:text-white/80 mb-2 tracking-wide">
                CHARACTER NAME
              </label>
              <div className="relative group">
                <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300 ${isFocused === 'characterName' ? 'text-primary filter drop-shadow-[0_0_8px_var(--color-primary-glow)]' : 'text-primary/50'}`}></div>
                <input
                  type="text"
                  value={characterName}
                  onChange={(e) => setCharacterName(e.target.value)}
                  onFocus={() => setIsFocused('characterName')}
                  onBlur={() => setIsFocused(null)}
                  className="w-full bg-white/90 border border-border-primary/30 rounded-lg pl-12 pr-4 py-3 text-black placeholder-gray-500 focus:outline-none focus:border-border-primary focus:shadow-stark-glow transition-all duration-300"
                  placeholder="Character Name"
                />
                <div className={`absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-primary/0 to-transparent pointer-events-none transition-all duration-500 ${isFocused === 'characterName' ? 'via-primary/10' : ''}`}></div>
              </div>
            </div>

            {/* Password Field */}
            <div className="relative">
              <label className="block text-sm text-primary/80 dark:text-white/80 mb-2 tracking-wide">
                PASSWORD
              </label>
              <div className="relative group">
                <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300 ${isFocused === 'password' ? 'text-primary filter drop-shadow-[0_0_8px_var(--color-primary-glow)]' : 'text-primary/50'}`}></div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setIsFocused('password')}
                  onBlur={() => setIsFocused(null)}
                  className="w-full bg-white/90 border border-border-primary/30 rounded-lg pl-12 pr-4 py-3 text-black placeholder-gray-500 focus:outline-none focus:border-border-primary focus:shadow-stark-glow transition-all duration-300"
                  placeholder="PW"
                />
                <div className={`absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-primary/0 to-transparent pointer-events-none transition-all duration-500 ${isFocused === 'password' ? 'via-primary/10' : ''}`}></div>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="relative">
              <label className="block text-sm text-primary/80 dark:text-white/80 mb-2 tracking-wide">
                CONFIRM PASSWORD
              </label>
              <div className="relative group">
                <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300 ${isFocused === 'confirmPassword' ? 'text-primary filter drop-shadow-[0_0_8px_var(--color-primary-glow)]' : 'text-primary/50'}`}></div>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onFocus={() => setIsFocused('confirmPassword')}
                  onBlur={() => setIsFocused(null)}
                  className="w-full bg-white/90 border border-border-primary/30 rounded-lg pl-12 pr-4 py-3 text-black placeholder-gray-500 focus:outline-none focus:border-border-primary focus:shadow-stark-glow transition-all duration-300"
                  placeholder="Confirm Password"
                />
                <div className={`absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-primary/0 to-transparent pointer-events-none transition-all duration-500 ${isFocused === 'confirmPassword' ? 'via-primary/10' : ''}`}></div>
              </div>
            </div>

            {/* ACCESS CODE Field */}
            <div className="relative">
              <label className="block text-sm text-primary/80 dark:text-white/80 mb-2 tracking-wide">
                ACCESS CODE
              </label>
              <div className="relative group">
                <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300 ${isFocused === 'accessCode' ? 'text-primary filter drop-shadow-[0_0_8px_var(--color-primary-glow)]' : 'text-primary/50'}`}></div>
                <input
                  type="text"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  onFocus={() => setIsFocused('accessCode')}
                  onBlur={() => setIsFocused(null)}
                  className="w-full bg-white/90 border border-border-primary/30 rounded-lg pl-12 pr-4 py-3 text-black placeholder-gray-500 focus:outline-none focus:border-border-primary focus:shadow-stark-glow transition-all duration-300"
                  placeholder="Access Code"
                />
                <div className={`absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-primary/0 to-transparent pointer-events-none transition-all duration-500 ${isFocused === 'accessCode' ? 'via-primary/10' : ''}`}></div>
              </div>
            </div>

            {/* 에러 메시지 */}
            {errorMsg && (
              <p className="text-red-400 text-xs text-center tracking-wide">{errorMsg}</p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/80 hover:to-primary text-white font-medium py-3 rounded-lg transition-all duration-300 relative overflow-hidden group shadow-stark-glow hover:shadow-[0_0_30px_var(--color-primary-glow)]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/0 to-transparent group-hover:via-white/20 transition-all duration-500"></div>
              <span className="relative z-10 flex items-center justify-center gap-2 tracking-wide">
                ACCESS SYSTEM
              </span>
            </button>
          </form>

          {/* Status Indicator */}
          <div className="mt-8 pt-6 border-t border-border-primary/30">
            <div className="flex items-center justify-center gap-2 text-primary/50 dark:text-white/50 text-xs">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_var(--color-primary-glow)]"></div>
              <span className="tracking-wider">SECURE CONNECTION</span>
            </div>
          </div>

          {/* Corner decorations */}
          <div className="absolute top-3 left-3 w-4 h-4 border-t border-l border-border-primary/50"></div>
          <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-border-primary/50"></div>
          <div className="absolute bottom-3 left-3 w-4 h-4 border-b border-l border-border-primary/50"></div>
          <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-border-primary/50"></div>
        </div>

        {/* Bottom glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent blur-sm"></div>
      </div>
    </div>
  );
}