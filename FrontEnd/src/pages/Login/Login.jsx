import { useState } from 'react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isFocused, setIsFocused] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login attempt:', { username, password });
    // 로그인 로직 추가
  };

  return (
    <div className="w-full max-w-md relative">
      {/* Cyber grid background */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(cyan 1px, transparent 1px), linear-gradient(90deg, cyan 1px, transparent 1px)',
          backgroundSize: '30px 30px',
        }}
      ></div>

      <div className="relative bg-gradient-to-br from-cyan-950/40 to-cyan-900/20 border border-cyan-500/30 rounded-2xl p-12 backdrop-blur-sm shadow-[0_0_50px_rgba(34,211,238,0.15)] min-w-420px">
        {/* Top glow line */}
        <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_10px_rgba(34,211,238,0.5)]"></div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-cyan-400 tracking-wider mb-2 filter drop-shadow-[0_0_15px_rgba(34,211,238,0.6)]">
            NEXUS
          </h1>
          <p className="text-xs text-cyan-300/60 tracking-widest">
            AUTHENTICATION REQUIRED
          </p>
          <div className="mt-4 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username Field */}
          <div className="relative">
            <label className="block text-sm text-cyan-300/80 mb-2 tracking-wide">
              USERNAME
            </label>
            <div className="relative group">
              <div
                className={`absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300 ${
                  isFocused === 'username'
                    ? 'text-cyan-300 filter drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]'
                    : 'text-cyan-500/50'
                }`}
              >
    
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onFocus={() => setIsFocused('username')}
                onBlur={() => setIsFocused(null)}
                className="w-full bg-cyan-950/30 border border-cyan-500/30 rounded-lg pl-12 pr-4 py-3 text-cyan-100 placeholder-cyan-500/30 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all duration-300"
                placeholder="ID"
              />
              <div
                className={`absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-cyan-400/0 to-transparent pointer-events-none transition-all duration-500 ${
                  isFocused === 'username' ? 'via-cyan-400/10' : ''
                }`}
              ></div>
            </div>
          </div>

          {/* Password Field */}
          <div className="relative">
            <label className="block text-sm text-cyan-300/80 mb-2 tracking-wide">
              PASSWORD
            </label>
            <div className="relative group">
              <div
                className={`absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300 ${
                  isFocused === 'password'
                    ? 'text-cyan-300 filter drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]'
                    : 'text-cyan-500/50'
                }`}
              >
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setIsFocused('password')}
                onBlur={() => setIsFocused(null)}
                className="w-full bg-cyan-950/30 border border-cyan-500/30 rounded-lg pl-12 pr-4 py-3 text-cyan-100 placeholder-cyan-500/30 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all duration-300"
                placeholder="PW"
              />
              <div
                className={`absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-cyan-400/0 to-transparent pointer-events-none transition-all duration-500 ${
                  isFocused === 'password' ? 'via-cyan-400/10' : ''
                }`}
              ></div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white font-medium py-3 rounded-lg transition-all duration-300 relative overflow-hidden group shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/0 to-transparent group-hover:via-white/20 transition-all duration-500"></div>

            <span className="relative z-10 flex items-center justify-center gap-2 tracking-wide">
              ACCESS SYSTEM

            </span>
          </button>

          {/* Footer Links */}

        </form>

        {/* Status Indicator */}
        <div className="mt-8 pt-6 border-t border-cyan-500/30">
          <div className="flex items-center justify-center gap-2 text-cyan-400/50 text-xs">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.8)]"></div>
            <span className="tracking-wider">SECURE CONNECTION</span>
          </div>
        </div>

        {/* Corner decorations */}
        <div className="absolute top-3 left-3 w-4 h-4 border-t border-l border-cyan-400/50"></div>
        <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-cyan-400/50"></div>
        <div className="absolute bottom-3 left-3 w-4 h-4 border-b border-l border-cyan-400/50"></div>
        <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-cyan-400/50"></div>
      </div>

      {/* Bottom glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent blur-sm"></div>
    </div>
  );
}
