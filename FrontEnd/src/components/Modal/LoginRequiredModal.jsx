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
            bg-slate-100 dark:bg-slate-900
            border border-primary/30
            shadow-stark-glow
            glow-effect
          "
        >
          <Dialog.Title
            className="px-6 py-4 text-primary font-bold tracking-widest border-b border-primary/30"
          >
            ACCESS RESTRICTED
          </Dialog.Title>

          <div className="p-6 text-text-main/80">
            로그인이 필요한 페이지입니다.
          </div>

          <div className="flex justify-end gap-3 px-6 py-4 border-t border-primary/30">
            <button
              className="px-4 py-2 rounded bg-primary/20 text-primary/80 hover:bg-primary/30"
              onClick={() => navigate('/login')}
            >
              LOGIN
            </button>
            <button
              className="px-4 py-2 bg-primary/20 text-primary/60 hover:text-text-main"
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