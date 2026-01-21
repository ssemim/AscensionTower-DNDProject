import { useState, useEffect, useLayoutEffect, useRef } from 'react'
import './App.css'

import Menu from './components/Menu/Menu'
import PinSpinner from './components/Spinner/PinSpinner'
import Particles from './components/Particles/Particles'
import { Routes, Route, useLocation } from 'react-router-dom'
import Landing from './pages/Landing/Landing'
import Login from './pages/Login/Login'
import SignUp from './pages/SignUp/SignUp'
import MyPage from './pages/MyPage/MyPage'
import Shop from './pages/Shop/Shop'
import World from './pages/World/World'
import './index.css';

function App() {
  const [loading, setLoading] = useState(true)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()
  const prevPathname = useRef(location.pathname)

  useEffect(() => {
    // demo: hide spinner after 1.5s; replace with real loading logic
    const t = setTimeout(() => setLoading(false), 1500)
    return () => clearTimeout(t)
  }, [])

  useLayoutEffect(() => {
    // Set initial menu state based on path only when path changes
    if (prevPathname.current !== location.pathname) {
      const shouldMenuOpen = !location.pathname.startsWith('/shop') && !location.pathname.startsWith('/mypage')
      // eslint-disable-next-line react-hooks/exhaustive-deps
      setIsMenuOpen(shouldMenuOpen)
      prevPathname.current = location.pathname
    }
  }, [location.pathname])

  

  return (
    <>
      <PinSpinner show={loading} size={260} />
      <div className="app-layout">
      <div className="bg-canvas" aria-hidden="true">
        <Particles />
        <span className="vignette" />
        <span className="light l1" />
        <span className="light l2" />
        <span className="light l3" />
        <span className="backlight" />
      </div>
      <Menu isOpen={isMenuOpen} onToggle={() => setIsMenuOpen(!isMenuOpen)} />
      

      <main className={isMenuOpen ? 'content with-sidebar' : 'content'}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/world" element={<World />} />
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </main>
    </div>
    </>
  )
}

export default App
