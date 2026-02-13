import { useNavigate } from 'react-router-dom'
import LoginRequiredModal from '../../components/Modal/LoginRequiredModal'

export default function MyPage() {
  const navigate = useNavigate()

  const isLoggedIn = Boolean(localStorage.getItem('accessToken'))

  if (!isLoggedIn) {
    return (
      <LoginRequiredModal
        open={true}
        onClose={() => navigate('/login')}
      />
    )
  }

  return (
    <div className="page mypage bg-main text-text-main min-h-screen p-4">
      <h2>My Page</h2>
      <p>유저 마이페이지입니다.</p>
    </div>
  )
}
