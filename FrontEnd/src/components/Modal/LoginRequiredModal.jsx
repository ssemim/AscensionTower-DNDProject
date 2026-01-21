import { Dialog } from '@headlessui/react'
import { useNavigate } from 'react-router-dom'

export default function LoginRequiredModal({ open, onClose }) {
  const navigate = useNavigate()

  return (
    <Dialog open={open} onClose={onClose} className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel
          className="
            w-full max-w-md
            rounded-xl
            bg-slate-900
            border border-cyan-500/30
            shadow-[0_0_40px_rgba(34,211,238,0.3)]
            glow-effect
          "
        >
          <Dialog.Title
            className="px-6 py-4 text-cyan-400 font-bold tracking-widest border-b border-cyan-500/30"
          >
            ACCESS RESTRICTED
          </Dialog.Title>

          <div className="p-6 text-cyan-200/80">
            로그인이 필요한 페이지입니다.
          </div>

          <div className="flex justify-end gap-3 px-6 py-4 border-t border-cyan-500/30">
            <button
              className="px-4 py-2 rounded bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30"
              onClick={() => navigate('/login')}
            >
              LOGIN
            </button>
            <button
              className="px-4 py-2 bg-cyan-500/20 text-cyan-400/60 hover:text-white"
              onClick={onClose}
            >
              CANCEL
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}
