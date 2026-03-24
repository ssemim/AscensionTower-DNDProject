import { useState, useEffect, useLayoutEffect, useRef } from 'react'
import './App.css'

import Menu from './components/Menu/Menu'
import PinSpinner from './components/Spinner/PinSpinner'
import { Routes, Route, useLocation } from 'react-router-dom'
import Landing from './pages/Landing/Landing'
import Login from './pages/Login/Login'
import SignUp from './pages/SignUp/SignUp'
import MyPage from './pages/MyPage/MyPage'
import Shop from './pages/Shop/Shop'
import World from './pages/World/World'
import Blackjack from './pages/BlackJack/Blackjack'
import NotFound from './pages/404/404'
import MouseEffect from './components/MouseEffect/MouseEffect'
import { useDispatch } from 'react-redux'
import { login } from './store/authSlice'  
import axios from 'axios'                 
import './index.css';

function App() {
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()
  const prevPathname = useRef(location.pathname)

  useEffect(() => {
    // demo: hide spinner after 1.5s; replace with real loading logic
    const t = setTimeout(() => setLoading(false), 1500)
    return () => clearTimeout(t)
  }, [])

    useEffect(() => {
    // 앱 시작 시 서버에 토큰 유효성 확인
    axios.get('http://localhost:8081/auth-check', { withCredentials: true })
      .then(res => {
        if (res.data.Status === 'Success') dispatch(login());
      })
      .catch(() => {}); // 토큰 없거나 만료면 그냥 로그아웃 상태 유지
  }, []);

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
      <MouseEffect />
      <PinSpinner show={loading} size={260} />
      <Menu isOpen={isMenuOpen} onToggle={() => setIsMenuOpen(!isMenuOpen)} />
      

      <main className={isMenuOpen ? 'content with-sidebar' : 'content'}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/world" element={<World />} />
          <Route path="/blackjack" element={<Blackjack />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  )
}

export default App
