import { NavLink } from 'react-router-dom';
import { useTheme } from '../ThemeProvider/ThemeProvider'; // 경로를 프로젝트 구조에 맞게 수정하세요
import './Menu.css';

export default function Menu({ isOpen, onToggle }) {
  const { isDark, toggleTheme } = useTheme(); // 테마 훅 불러오기

  const menuItems = [
    { to: '/world', label: 'World' },
    { to: '/login', label: 'Login' },
    { to: '/signup', label: 'Sign Up' },
    { to: '/shop', label: 'Shop' },
    { to: '/mypage', label: 'My Page' },
  ];

  return (
    <>
      {/* 🔥 햄버거 버튼 */}
      {!isOpen && (
        <button
          onClick={onToggle}
          className="
            fixed top-4 left-4 z-[60]
            bg-primary/80 hover:bg-primary
            text-white p-3 rounded-lg
            backdrop-blur-sm transition-all
            shadow-stark-glow
            opacity-0 hover:opacity-100
          "
        >
          ☰
        </button>
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-screen w-64 z-50
          bg-main border-r border-primary/30 backdrop-blur-sm
          transition-transform duration-300
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Grid Background (Tailwind 설정값 사용) */}
        <div className="absolute inset-0 opacity-10 bg-stark-grid bg-[length:20px_20px]" />

        {/* 🔥 닫기 버튼 */}
        {isOpen && (
          <button
            onClick={onToggle}
            className="
              absolute top-4 right-4 z-[60]
              bg-primary/80 hover:bg-primary
              text-white p-2 rounded-lg
              backdrop-blur-sm transition-all
              opacity-40 hover:opacity-100
            "
          >
            ✕
          </button>
        )}

        <div className="relative z-10 p-6 flex flex-col h-full">
          {/* Header */}
          <NavLink
            to="/"
            className="block mb-8 pb-6 border-b border-primary/30"
          >
            <h4 className="text-2xl font-bold text-primary italic">THE TOWER :</h4>
            <h4 className="text-xl font-bold text-text-main">
              FALLING TO ASCENSION
            </h4>
            <p className="text-xs text-primary/60 mt-1 tracking-widest">
              SYSTEM v2.0
            </p>
          </NavLink>

          {/* Menu Items */}
          <nav className="space-y-2 flex-grow">
            {menuItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `
                  block px-4 py-3 rounded-lg transition-all duration-200
                  ${isActive
                    ? 'bg-primary/20 text-primary shadow-[inset_0_0_10px_rgba(34,211,238,0.1)]'
                    : 'text-text-main/70 hover:text-primary hover:bg-primary/5'}
                `
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* 🔥 Theme Toggle Section (하단 고정) */}
          <div className="pt-6 border-t border-primary/30">
            <div className="flex items-center justify-between px-2">
              <span className="text-xs font-bold text-primary/60 uppercase tracking-tighter">
                System Theme
              </span>
              <button
                onClick={toggleTheme}
                className={`
                  relative w-12 h-6 rounded-full border border-primary/50 transition-all
                  ${isDark ? 'bg-primary/10 shadow-stark-glow' : 'bg-gray-200'}
                `}
              >
                <div 
                  className={`
                    absolute top-1 w-3.5 h-3.5 rounded-full bg-primary transition-all duration-300
                    ${isDark ? 'left-7' : 'left-1'}
                  `} 
                />
              </button>
            </div>
            <p className="text-[10px] text-center mt-4 opacity-30 uppercase">
              Environment: {isDark ? 'Dark-Stark' : 'Bright-Lab'}
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}