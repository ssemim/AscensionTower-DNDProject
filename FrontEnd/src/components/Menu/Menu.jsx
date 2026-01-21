import { NavLink } from 'react-router-dom';
import './Menu.css';

export default function Menu({ isOpen, onToggle }) {
  const menuItems = [
    { to: '/world', label: 'World' },
    { to: '/login', label: 'Login' },
    { to: '/signup', label: 'Sign Up' },
    { to: '/shop', label: 'Shop' },
    { to: '/mypage', label: 'My Page' },
  ];

  return (
    <>
      {/* 🔥 햄버거 버튼 (메뉴 닫힘 시 fixed left, 열림 시 aside 안 right) */}
      {!isOpen && (
        <button
          onClick={onToggle}
          className="
            fixed top-4 left-4 z-[60]
            bg-cyan-600/80 hover:bg-cyan-500
            text-white p-3 rounded-lg
            backdrop-blur-sm transition-all
            shadow-[0_0_20px_rgba(34,211,238,0.6)]
            opacity-0 hover:opacity-100
          "
        >
          ☰
        </button>
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-screen w-48 z-50
          bg-gradient-to-b from-cyan-950/40 to-cyan-900/20
          border-r border-cyan-500/30 backdrop-blur-sm
          transition-transform duration-300
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'linear-gradient(cyan 1px, transparent 1px), linear-gradient(90deg, cyan 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />

        {/* 🔥 햄버거 버튼 (메뉴 열림 시 aside 안 right) */}
        {isOpen && (
          <button
            onClick={onToggle}
            className="
              absolute top-4 right-4 z-[60]
              bg-cyan-600/80 hover:bg-cyan-500
              text-white p-3 rounded-lg
              backdrop-blur-sm transition-all
              shadow-[0_0_20px_rgba(34,211,238,0.6)]
              opacity-0 hover:opacity-100
            "
          >
            ✕
          </button>
        )}

        <div className="relative z-10 p-6">
          {/* Header */}
          <NavLink
            to="/"
            className="block mb-8 pb-6 border-b border-cyan-500/30"
          >
            <h4 className="text-2xl font-bold text-cyan-400">THE TOWER :</h4>
            <h4 className="text-xl font-bold text-white">
              FALLING TO ASCENSION
            </h4>
            <p className="text-xs text-cyan-300/60 mt-1 tracking-widest">
              SYSTEM v2.0
            </p>
          </NavLink>

          {/* Menu Items */}
          <nav className="space-y-2">
            {menuItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `
                  block px-4 py-3 rounded-lg transition
                  ${isActive
                    ? 'bg-cyan-500/20 text-cyan-300'
                    : 'text-cyan-400/70 hover:text-white'}
                `
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
}
