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

      

      <div className="min-h-screen bg-main flex items-center justify-center">

        <div className="absolute inset-0 opacity-[0.05] bg-stark-grid bg-[length:40px_40px] pointer-events-none"></div>

        <div className="w-full max-w-md relative">

          <div className="relative bg-gradient-to-br from-slate-900/40 to-slate-800/20 dark:from-cyan-950/40 dark:to-cyan-900/20 border border-primary/30 rounded-2xl p-12 backdrop-blur-sm shadow-stark-glow min-w-420px">

            {/* Top glow line */}

            <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_10px_var(--color-primary-glow)]"></div>

  

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-primary tracking-wider mb-2 filter drop-shadow-[0_0_15px_var(--color-primary-glow)]">
              NEXUS
            </h1>
            <p className="text-xs text-primary/60 tracking-widest">
              AUTHENTICATION REQUIRED
            </p>
            <div className="mt-4 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <div className="relative">
              <label className="block text-sm text-primary/80 mb-2 tracking-wide">
                USERNAME
              </label>
              <div className="relative group">
                <div
                  className={`absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300 ${
                    isFocused === 'username'
                      ? 'text-primary filter drop-shadow-[0_0_8px_var(--color-primary-glow)]'
                      : 'text-primary/50'
                  }`}
                >
      
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onFocus={() => setIsFocused('username')}
                  onBlur={() => setIsFocused(null)}
                  className="w-full bg-slate-200/10 dark:bg-cyan-950/30 border border-primary/30 rounded-lg pl-12 pr-4 py-3 text-text-main placeholder-primary/30 focus:outline-none focus:border-primary focus:shadow-stark-glow transition-all duration-300"
                  placeholder="ID"
                />
                <div
                  className={`absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-primary/0 to-transparent pointer-events-none transition-all duration-500 ${
                    isFocused === 'username' ? 'via-primary/10' : ''
                  }`}
                ></div>
              </div>
            </div>

            {/* Password Field */}
            <div className="relative">
              <label className="block text-sm text-primary/80 mb-2 tracking-wide">
                PASSWORD
              </label>
              <div className="relative group">
                <div
                  className={`absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300 ${
                    isFocused === 'password'
                      ? 'text-primary filter drop-shadow-[0_0_8px_var(--color-primary-glow)]'
                      : 'text-primary/50'
                  }`}
                >
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setIsFocused('password')}
                  onBlur={() => setIsFocused(null)}
                  className="w-full bg-slate-200/10 dark:bg-cyan-950/30 border border-primary/30 rounded-lg pl-12 pr-4 py-3 text-text-main placeholder-primary/30 focus:outline-none focus:border-primary focus:shadow-stark-glow transition-all duration-300"
                  placeholder="PW"
                />
                <div
                  className={`absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-primary/0 to-transparent pointer-events-none transition-all duration-500 ${
                    isFocused === 'password' ? 'via-primary/10' : ''
                  }`}
                ></div>
              </div>
            </div>

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

            {/* Footer Links */}

          </form>

          {/* Status Indicator */}
          <div className="mt-8 pt-6 border-t border-primary/30">
            <div className="flex items-center justify-center gap-2 text-primary/50 text-xs">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_var(--color-primary-glow)]"></div>
              <span className="tracking-wider">SECURE CONNECTION</span>
            </div>
          </div>

          {/* Corner decorations */}
          <div className="absolute top-3 left-3 w-4 h-4 border-t border-l border-primary/50"></div>
          <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-primary/50"></div>
          <div className="absolute bottom-3 left-3 w-4 h-4 border-b border-l border-primary/50"></div>
          <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-primary/50"></div>
        </div>

        {/* Bottom glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent blur-sm"></div>
      </div>
    </div>
  );
}