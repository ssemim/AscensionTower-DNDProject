import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import Typewriter from 'typewriter-effect';
import { addItem, removeItem, clearCart, decreaseItem } from '../../store/cartSlice';
import dialog from './dialog';
import itemsData from './item.js';
import BuyItemModal from '../../components/Modal/BuyItemModal.jsx';
import './Shop.css';

const API = 'http://localhost:8081';

const HUDBox = ({ children, className = "" }) => (
  <div className={`relative border border-border-primary bg-slate-200/10 dark:bg-black/40 backdrop-blur-md ${className}`}>
    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-border-primary"></div>
    <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-border-primary"></div>
    {children}
  </div>
);

const Shop = () => {
  const [rightPanelTab, setRightPanelTab] = useState('inspect');
  const dispatch = useDispatch();
  
  // 리덕스에서 로그인 상태 및 카트 아이템 가져오기
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
  const cartItems = useSelector(state => state.cart.items);
  
  const [merchantDialog] = useState(() => {
    const randomIndex = Math.floor(Math.random() * dialog.length);
    return dialog[randomIndex];
  });
  
  const [isAcquiring, setIsAcquiring] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [point, setPoint] = useState(null);
  const [items] = useState(itemsData);
  const [selected, setSelected] = useState(items[0]);

  // 포인트 조회 (로그인 된 경우에만 시도)
  useEffect(() => {
    if (isLoggedIn) {
      axios.get(`${API}/shop/point`, { withCredentials: true })
        .then(res => {
          if (res.data.Status === 'Success') setPoint(res.data.point);
        })
        .catch(err => console.error('포인트 조회 실패:', err));
    }
  }, [isLoggedIn]);

  // 구매/선물 완료 후 포인트 갱신
  const handlePurchaseSuccess = (newPoint) => {
    setPoint(newPoint);
    dispatch(clearCart());
  };

  const item8InCart = cartItems.find(item => item.id === 8 || item.id === '8');
  const isItem8Exceeded = item8InCart && item8InCart.quantity >= 2;

  return (
    <div className="min-h-screen bg-main text-text-main font-one-store-mobile-gothic-body p-4 md:p-8 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.05] dark:opacity-10 pointer-events-none"
        style={{ backgroundImage: 'linear-gradient(var(--color-primary) 1px, transparent 1px), linear-gradient(90deg, var(--color-primary) 1px, transparent 1px)', backgroundSize: '50px 50px' }}>
      </div>

      <header className="max-w-7xl mx-auto flex justify-between items-end mb-8 border-b border-border-primary pb-4 relative z-10">
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 border-2 border-border-primary rotate-45 flex items-center justify-center bg-primary/10 dark:bg-cyan-950/20 shadow-stark-glow">
            <img src="/src/assets/image/logo_trans.png" alt="logo" className="w-full h-full object-contain -rotate-45" />
          </div>
          <div>
            <h1 className="text-4xl font-black italic font-nexon-warhaven tracking-tighter text-text-main uppercase drop-shadow-[0_0_10px_var(--color-primary-glow)]">36TH FLOOR</h1>
            <p className="text-[10px] text-primary/70 font-bold tracking-[0.4em] uppercase">Authorized Access Only // Sector_04</p>
          </div>
        </div>
        
        {/* 포인트 표시 조건부 렌더링 */}
        <div className="text-right">
          {isLoggedIn ? (
            <div className="text-3xl font-one-store-mobile-gothic-body font-black text-text-main italic tracking-widest animate-fade-in">
              {point !== null ? point.toLocaleString() : '...'} <span className="text-primary/80 text-sm italic">CR</span>
            </div>
          ) : (
            <div className="text-sm font-bold text-primary/60 italic tracking-tighter px-4 py-2 bg-primary/5 rounded-sm">
              로그인 후 구매가 가능합니다
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-12 gap-6 relative z-10">
        {/* Left: NPC & Dialogue */}
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-4">
          <HUDBox className="aspect-[4/5] overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"></div>
            <div className="h-full flex flex-col items-center justify-center p-8 text-center">
              <div className="merchant-container">
                <div className="merchant-glow"></div>
                <img src="/images/NPCS/merchant.gif" alt="Merchant" className="sway-animation w-48 h-48 object-contain" />
              </div>
              <p className="text-[10px] font-black tracking-widest text-primary/60 opacity-60 uppercase mb-1">Unit_B3AR-S</p>
              <h3 className="text-xl font-bold text-text-main tracking-widest uppercase italic">B3AR-S</h3>
            </div>
          </HUDBox>
          <HUDBox className="p-4 bg-main/60">
            <div className="text-[14px] leading-relaxed font-one-store-mobile-gothic-body font-bold text-text-main/80 italic">
              "{merchantDialog && (
                <Typewriter
                  onInit={(typewriter) => {
                    typewriter.pauseFor(1000).typeString(merchantDialog).start();
                  }}
                  options={{ delay: 80, cursor: '' }}
                />
              )}"
            </div>
          </HUDBox>
        </div>

        {/* Center: Inventory Grid */}
        <div className="col-span-12 lg:col-span-5 flex flex-col gap-4">
          <div className="grid grid-cols-4 gap-2 bg-main p-4 border border-border-primary h-full">
            {items.map((item) => (
              <div
                key={item.id}
                onClick={() => !item.isEmpty && setSelected(item)}
                className={`
                  aspect-square border flex flex-col items-center justify-center relative transition-all cursor-pointer group
                  ${item.isEmpty ? 'border-border-primary bg-main/40 opacity-30' : 'border-border-primary/70 bg-primary/10 hover:border-primary hover:shadow-stark-glow'}
                  ${selected?.id === item.id ? 'border-primary bg-primary/30 ring-1 ring-primary' : ''}
                `}
              >
                {!item.isEmpty && (
                  <img src={item.src} alt={item.name} className="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform" />
                )}
                <span className="absolute bottom-1 right-1 text-[8px] opacity-20 font-bold italic tracking-tighter">{item.id}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Inspection & Cart */}
        <div className="col-span-12 lg:col-span-4 flex flex-col font-one-store-mobile-gothic-body">
          <div className="flex border-b border-border-primary">
            <button
              onClick={() => setRightPanelTab('inspect')}
              className={`flex-1 py-2 px-4 text-xs font-black uppercase tracking-widest transition-all ${rightPanelTab === 'inspect' ? 'bg-primary/20 text-text-main border-b-2 border-border-primary' : 'text-primary/70 hover:bg-primary/10'}`}
            >
              Inspect
            </button>
            <button
              onClick={() => setRightPanelTab('cart')}
              className={`flex-1 py-2 px-4 text-xs font-black uppercase tracking-widest transition-all ${rightPanelTab === 'cart' ? 'bg-primary/20 text-text-main border-b-2 border-border-primary' : 'text-primary/70 hover:bg-primary/10'}`}
            >
              Cart ({cartItems.reduce((sum, item) => sum + item.quantity, 0)})
            </button>
          </div>

          {rightPanelTab === 'inspect' && (
            <HUDBox className="p-6 bg-main/80 flex-1 flex flex-col border-t-0 border-border-primary shadow-stark-glow">
              <div className="mb-8 border-b border-border-primary pb-4">
                <span className="bg-primary/90 text-text-main/80 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest">{selected?.rarity || 'SCANNING'}</span>
                <h2 className="text-3xl font-black text-text-main mt-2 tracking-wide italic uppercase">{selected?.name || '---'}</h2>
                <p className="text-lg font-black text-primary/80 mt-2">{selected?.price ? `${selected.price} CR` : 'N/A'}</p>
              </div>
              <div className="space-y-6 flex-1">
                <div>
                  <div className="flex justify-between text-[12px] font-black uppercase tracking-widest mb-1">
                    <span className="text-primary/70">임의 스텟</span>
                    <span className="text-text-main text-[12px]">{selected?.stats?.ATK || 0}%</span>
                  </div>
                  <div className="w-full h-1 bg-primary/10 rounded-full overflow-hidden">
                    <div className="h-full bg-primary shadow-stark-glow transition-all duration-700 ease-out" style={{ width: `${selected?.stats?.ATK || 0}%` }}></div>
                  </div>
                </div>
                <div className="p-4 border-l-2 border-border-primary bg-primary/5 italic text-[16px] leading-relaxed text-text-main/60 mt-8">
                  {`> LOG_READOUT: ${selected?.desc || 'Awaiting selection for neural link diagnostic...'}`}
                </div>
              </div>
              {(() => {
                const selectedIsItem8 = selected?.id === 8 || selected?.id === '8';
                const blockAdd = selectedIsItem8 && !!item8InCart;
                
                // 로그인 여부에 따른 버튼 텍스트 및 상태
                const buttonText = !isLoggedIn 
                  ? '로그인이 필요합니다' 
                  : isAcquiring 
                    ? '불러오는 중...' 
                    : blockAdd 
                      ? '오르골은 1개만 담을 수 있습니다' 
                      : `장바구니 담기 // ${selected?.price || '0'} CR`;

                return (
                  <button
                    onClick={() => {
                      if (isLoggedIn && selected && !selected.isEmpty && !isAcquiring && !blockAdd) {
                        setIsAcquiring(true);
                        dispatch(addItem(selected));
                        setTimeout(() => setIsAcquiring(false), 1000);
                      }
                    }}
                    disabled={!isLoggedIn || !selected || selected.isEmpty || isAcquiring || blockAdd}
                    className="mt-8 bg-primary hover:bg-text-main text-main font-black py-4 text-sm uppercase tracking-[0.2em] transition-all transform active:scale-95 shadow-stark-glow disabled:opacity-50 disabled:cursor-not-allowed">
                    {buttonText}
                  </button>
                );
              })()}
            </HUDBox>
          )}

          {rightPanelTab === 'cart' && (
            <HUDBox className="p-6 bg-main/80 flex-1 flex flex-col border-t-0 border-border-primary shadow-stark-glow">
              {cartItems.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center text-xl">
                  <p className="text-sm text-primary/70 italic mb-4">카트가 비어있습니다</p>
                  <p className="text-xs text-text-main/50">담기 버튼을 통해 카트에 아이템을 담아주세요.</p>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xl font-black uppercase tracking-widest">Cart</h3>
                    <button onClick={() => dispatch(clearCart())} className="text-red-500 hover:text-red-400 text-xs uppercase tracking-widest">Clear Cart</button>
                  </div>
                  <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-2">
                    {cartItems.map(item => {
                      const isItem8 = item.id === 8 || item.id === '8';
                      return (
                        <div key={item.id} className="grid grid-cols-12 gap-2 items-center bg-primary/5 py-4 px-2 border-l-2 border-border-primary">
                          <div className="col-span-6">
                            <p className="text-base space-x-1 truncate">{item.name}</p>
                          </div>
                          <div className="col-span-4 text-center flex justify-around items-center">
                            <button onClick={() => dispatch(decreaseItem(item))} className="text-lg w-6 h-6 flex items-center justify-center bg-primary/20 rounded-sm">-</button>
                            <p className="text-base font-one-store-mobile-gothic-body">x{item.quantity}</p>
                            <button
                              onClick={() => dispatch(addItem(item))}
                              disabled={isItem8 && item.quantity >= 1}
                              className={`text-lg w-6 h-6 flex items-center justify-center bg-primary/20 rounded-sm transition-opacity ${isItem8 && item.quantity >= 1 ? 'opacity-30 cursor-not-allowed' : ''}`}
                            >+</button>
                          </div>
                          <div className="col-span-2 text-right">
                            <button onClick={() => dispatch(removeItem(item.id))} className="text-red-500 hover:text-red-400 text-base">지우기</button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-2 text-right text-sm font-bold">
                    합계: {cartItems.reduce((sum, itm) => sum + parseFloat(String(itm.price).replace(/,/g, '')) * itm.quantity, 0)} CR
                  </div>
                  {isItem8Exceeded && (
                    <p className="mt-2 text-right text-[11px] text-red-400">
                      ⚠ 오르골 아이템은 한 번에 하나씩만 구매가 가능합니다.
                    </p>
                  )}
                  <div className="mt-4 pt-4 border-t border-border-primary flex justify-end gap-4">
                    <button
                      onClick={() => isLoggedIn && !isItem8Exceeded && setModalType('buy')}
                      disabled={!isLoggedIn || isItem8Exceeded}
                      className={`bg-primary text-main font-black py-2 px-4 text-xs uppercase tracking-widest transition-all ${(!isLoggedIn || isItem8Exceeded) ? 'opacity-40 cursor-not-allowed filter grayscale' : 'hover:bg-text-main'}`}
                    >{isLoggedIn ? '구매하기' : '로그인 필요'}</button>
                    <button
                      onClick={() => isLoggedIn && !isItem8Exceeded && setModalType('gift')}
                      disabled={!isLoggedIn || isItem8Exceeded}
                      className={`bg-primary text-main font-black py-2 px-4 text-xs uppercase tracking-widest transition-all ${(!isLoggedIn || isItem8Exceeded) ? 'opacity-40 cursor-not-allowed filter grayscale' : 'hover:bg-text-main'}`}
                    >{isLoggedIn ? '선물하기' : '로그인 필요'}</button>
                  </div>
                </>
              )}
            </HUDBox>
          )}
        </div>
      </main>

      {modalType && (
        <BuyItemModal
          isOpen={!!modalType}
          type={modalType}
          items={cartItems}
          currentPoint={point}
          onClose={() => setModalType(null)}
          onSuccess={handlePurchaseSuccess}
        />
      )}
    </div>
  );
};

export default Shop;