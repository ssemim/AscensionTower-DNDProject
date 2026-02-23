import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../ThemeProvider/ThemeProvider';

/**
 * Stark Industries Theme Access Restricted Modal
 * @param {boolean} open - 모달 표시 여부
 * @param {function} onClose - 모달 닫기 함수
 */
export default function StarkAccessModal({ open, onClose }) {
  const navigate = useNavigate();
  const { isDark } = useTheme();

  return (
    <Transition show={open} as={Fragment}>
      <Dialog as="div" className="relative z-[100] font-mono" onClose={onClose}>
        
        {/* 1. Backdrop (배경 흐림 처리) */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 dark:bg-[#02060a]/90 backdrop-blur-sm" aria-hidden="true" />
        </Transition.Child>

        {/* 2. Modal Positioning (중앙 정렬) */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95 translate-y-4"
              enterTo="opacity-100 scale-100 translate-y-0"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100 translate-y-0"
              leaveTo="opacity-0 scale-95 translate-y-4"
            >
              <Dialog.Panel className="relative w-full max-w-md transform overflow-hidden 
                bg-white dark:bg-black 
                border border-gray-300 dark:border-cyan-500/50 
                shadow-xl dark:shadow-[0_0_50px_rgba(34,211,238,0.2)] 
                text-left align-middle transition-all">
                
                {/* --- Tactical Header --- */}
                <div className="relative z-10 px-6 py-4 
                  bg-gray-100 dark:bg-cyan-900/20 
                  border-b border-gray-200 dark:border-cyan-900/50 
                  flex justify-between items-center">
                  <div>
                    <Dialog.Title as="h3" className="text-gray-900 dark:text-white font-black italic tracking-[0.2em] uppercase text-lg">
                      Access Restricted
                    </Dialog.Title>
                    <div className="flex gap-2 mt-1">
                      <span className="text-[8px] text-gray-500 dark:text-cyan-700 font-bold uppercase tracking-widest">Sys_Ref: Stark-OS-V.4.2</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[8px] text-red-500 font-black uppercase tracking-widest">Auth_Status: Denied</p>
                    <p className="text-[8px] text-gray-500 dark:text-cyan-700 font-bold uppercase tracking-widest mt-0.5">Loc: Sector_7G</p>
                  </div>
                </div>

                {/* --- Content Area --- */}
                <div className="relative z-10 p-8 space-y-6">
                  <div className="flex items-start gap-4 p-4 
                    border border-gray-300 dark:border-cyan-400/30 
                    bg-gray-50 dark:bg-cyan-400/5">
                    <div className="w-10 h-10 border border-gray-400 dark:border-cyan-400 flex items-center justify-center shrink-0">
                      <span className="text-gray-700 dark:text-cyan-400 text-xl font-black italic">!</span>
                    </div>
                    <div>
                      <p className="text-gray-900 dark:text-white text-lg font-bold leading-tight">로그인이 필요한 페이지입니다.</p>
                      <p className="text-[10px] text-gray-600 dark:text-cyan-600 mt-2 uppercase tracking-widest leading-relaxed">
                        &gt; Checking_Protocol... Success<br/>
                        &gt; Encrypted_Handshake... Fail<br/>
                        &gt; Error_Code: 0x000401_Unauthorized
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 dark:text-cyan-800 uppercase tracking-[0.3em]">
                    <span>Security_Level: Omega</span>
                    <div className="flex gap-1">
                      <div className="w-1 h-1 bg-red-500 rounded-full animate-ping" />
                      <div className="w-1 h-1 bg-gray-300 dark:bg-cyan-900 rounded-full" />
                    </div>
                  </div>
                </div>

                {/* --- Action Footer --- */}
                <div className="relative z-10 flex border-t border-gray-200 dark:border-cyan-900/50 bg-gray-50 dark:bg-cyan-950/10">
                  <button 
                    className="flex-1 px-6 py-4 
                      bg-cyan-500 text-black 
                      font-black text-xs uppercase tracking-[0.2em] 
                      hover:bg-cyan-600 dark:hover:bg-white 
                      transition-all shadow-[inset_0_0_20px_rgba(255,255,255,0.2)]" 
                    onClick={() => navigate('/login')}
                  >
                    Initiate_Login
                  </button>
                  <button 
                    className="flex-1 px-6 py-4 
                      text-gray-600 dark:text-cyan-600 
                      font-black text-xs uppercase tracking-[0.2em] 
                      hover:text-black dark:hover:text-white 
                      hover:bg-gray-200 dark:hover:bg-red-900/20 
                      transition-all border-l border-gray-200 dark:border-cyan-900/50" 
                    onClick={onClose}
                  >
                    Abort_Connection
                  </button>
                </div>

                {/* HUD Decoration Brackets */}
                <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-gray-300 dark:border-cyan-400/30" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-gray-300 dark:border-cyan-400/30" />
                
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}