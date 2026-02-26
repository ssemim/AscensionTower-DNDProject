import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Typewriter from 'typewriter-effect';
import { addItem, removeItem, clearCart, decreaseItem } from '../../store/cartSlice';
import dialog from './dialog';
import itemsData from './item.js';

// 공통 UI 컴포넌트: HUD 스타일의 테두리 박스
const HUDBox = ({ children, className = "" }) => (
  <div className={`relative border border-primary/20 bg-slate-200/10 dark:bg-black/40 backdrop-blur-md ${className}`}>
    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary"></div>
    <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-primary"></div>
    {children}
  </div>
);

const Shop = () => {
  const [rightPanelTab, setRightPanelTab] = useState('inspect');
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart.items);
  const [merchantDialog] = useState(() => {
    const randomIndex = Math.floor(Math.random() * dialog.length);
    return dialog[randomIndex];
  });
  const [isAcquiring, setIsAcquiring] = useState(false);

  // 인벤토리 아이템 데이터 (24개 슬롯)
  const [items] = useState(itemsData);

  const [selected, setSelected] = useState(items[0]);

  return (
    <div className="min-h-screen bg-main text-text-main font-mono p-4 md:p-8 relative overflow-hidden">
      {/* Background HUD Grid Layout */}
      <div className="absolute inset-0 opacity-[0.05] dark:opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(var(--color-primary) 1px, transparent 1px), linear-gradient(90deg, var(--color-primary) 1px, transparent 1px)', backgroundSize: '50px 50px' }}>
      </div>

      {/* Header HUD */}
      <header className="max-w-7xl mx-auto flex justify-between items-end mb-8 border-b border-primary/20 pb-4 relative z-10">
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 border-2 border-primary rotate-45 flex items-center justify-center bg-primary/10 dark:bg-cyan-950/20 shadow-stark-glow">
            <span className="text-3xl font-black -rotate-45 text-text-main">S</span>
          </div>
          <div>
            <h1 className="text-4xl font-black italic tracking-tighter text-text-main uppercase drop-shadow-[0_0_10px_var(--color-primary-glow)]">Armory_Exchange</h1>
            <p className="text-[10px] text-primary/70 font-bold tracking-[0.4em] uppercase">Authorized Access Only // Sector_04</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-black text-text-main italic tracking-widest">
            포인트 변수 <span className="text-primary/80 text-sm italic">CR</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-12 gap-6 relative z-10">
        
        {/* Left: NPC & Dialogue (3 cols) */}
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-4">
          <HUDBox className="aspect-[4/5] overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"></div>
            {/* NPC Visual Placeholder */}
            <div className="h-full flex flex-col items-center justify-center p-8 text-center animate-pulse">
              <div className="w-32 h-32 border-2 border-primary rounded-full mb-6 flex items-center justify-center">
                <div className="w-24 h-24 border border-primary/30 rounded-full animate-spin-slow"></div>
              </div>
              <p className="text-[10px] font-black tracking-widest text-primary/60 opacity-60 uppercase mb-1">Unit_K3-V4</p>
              <h3 className="text-xl font-bold text-text-main tracking-widest uppercase italic">The_Merchant</h3>
            </div>
          </HUDBox>
          <HUDBox className="p-4 bg-main/60">
            <div className="text-[14px] leading-relaxed font-dos-gothic font-bold text-text-main/80 italic">
              "{merchantDialog && (
                <Typewriter
                  onInit={(typewriter) => {
                    typewriter
                      .pauseFor(1000)
                      .typeString(merchantDialog)
                      .start();
                  }}
                  options={{
                    delay: 80,
                    cursor: '',
                  }}
                />
              )}"
            </div>
          </HUDBox>
        </div>

        {/* Center: Inventory Grid (5 cols) */}
        <div className="col-span-12 lg:col-span-5 flex flex-col gap-4">
          <div className="grid grid-cols-4 gap-2 bg-main p-4 border border-primary/30 h-full">
            {items.map((item) => (
              <div
                key={item.id}
                onClick={() => !item.isEmpty && setSelected(item)}
                className={`
                  aspect-square border flex flex-col items-center justify-center relative transition-all cursor-pointer group
                  ${item.isEmpty 
                    ? 'border-primary/20 bg-main/40 opacity-30' 
                    : 'border-primary/70 bg-primary/10 hover:border-primary hover:shadow-stark-glow'}
                  ${selected?.id === item.id ? 'border-primary bg-primary/30 ring-1 ring-primary' : ''}
                `}
              >
                {!item.isEmpty && (
                  <>
                    <div className="w-10 h-10 border border-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <div className="w-6 h-6 bg-primary/20"></div>
                    </div>
                  </>
                )}
                <span className="absolute bottom-1 right-1 text-[8px] opacity-20 font-bold italic tracking-tighter">{item.id}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Inspection & Cart HUD (4 cols) */}
        <div className="col-span-12 lg:col-span-4 flex flex-col font-dos-gothic">
          <div className="flex border-b border-primary/30">
              <button 
                onClick={() => setRightPanelTab('inspect')}
                className={`flex-1 py-2 px-4 text-xs font-black uppercase tracking-widest transition-all ${rightPanelTab === 'inspect' ? 'bg-primary/20 text-text-main border-b-2 border-primary' : 'text-primary/70 hover:bg-primary/10'}`}
              >
                Inspect
              </button>
              <button 
                onClick={() => setRightPanelTab('cart')}
                className={`flex-1 py-2 px-4 text-xs font-black uppercase tracking-widest transition-all ${rightPanelTab === 'cart' ? 'bg-primary/20 text-text-main border-b-2 border-primary' : 'text-primary/70 hover:bg-primary/10'}`}
              >
                Cart ({cartItems.reduce((sum, item) => sum + item.quantity, 0)})
              </button>
            </div>
          {rightPanelTab === 'inspect' && (
            <HUDBox className="p-6 bg-main/80 flex-1 flex flex-col border-t-0 border-primary shadow-stark-glow">
              <div className="mb-8 border-b border-primary/20 pb-4">
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
                    <div 
                      className="h-full bg-primary shadow-stark-glow transition-all duration-700 ease-out" 
                      style={{ width: `${selected?.stats?.ATK || 0}%` }}
                    ></div>
                  </div>
                </div>

                <div className="p-4 border-l-2 border-primary bg-primary/5 italic text-[16px] leading-relaxed text-text-main/60 mt-8">
                  {`> LOG_READOUT: ${selected?.desc || 'Awaiting selection for neural link diagnostic...'}`}
                </div>
              </div>

              <button 
                onClick={() => {
                  if (selected && !selected.isEmpty && !isAcquiring) {
                    setIsAcquiring(true);
                    dispatch(addItem(selected));
                    setTimeout(() => setIsAcquiring(false), 1000); // Prevent rapid clicks
                  }
                }}
                disabled={!selected || selected.isEmpty || isAcquiring}
                className="mt-8 bg-primary hover:bg-text-main text-main font-black py-4 text-sm uppercase tracking-[0.2em] transition-all transform active:scale-95 shadow-stark-glow disabled:opacity-50 disabled:cursor-not-allowed">
                {isAcquiring ? '불러오는 중...' : `장바구니 담기 // ${selected?.price || '0'} CR`}
              </button>
            </HUDBox>
          )}
          {rightPanelTab === 'cart' && (
             <HUDBox className="p-6 bg-main/80 flex-1 flex flex-col border-t-0 border-primary shadow-stark-glow">
              {cartItems.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center text-xl">
                   <p className="text-sm text-primary/70 italic mb-4">카트가 비어있습니다</p>
                   <p className="text-xs text-text-main/50">담기 버튼을 통해 카트에 아이템을 담아주세요.</p>
                </div>
              ) : (
                <>
                  {/* header row with clear button */}
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xl font-black uppercase tracking-widest">Cart</h3>
                    <button
                      onClick={() => dispatch(clearCart())}
                      className="text-red-500 hover:text-red-400 text-xs uppercase tracking-widest"
                    >
                      Clear Cart
                    </button>
                  </div>

                  <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-2">
                    {cartItems.map(item => (
                      <div key={item.id} className="grid grid-cols-12 gap-2 items-center bg-primary/5 py-4 px-2 border-l-2 border-primary">
                        <div className="col-span-6">
                          <p className="text-base space-x-1 truncate">{item.name}</p>
                        </div>
                        <div className="col-span-4 text-center flex justify-around items-center">
                          <button onClick={() => dispatch(decreaseItem(item))} className="text-lg w-6 h-6 flex items-center justify-center bg-primary/20 rounded-sm">-</button>
                          <p className="text-base font-mono">x{item.quantity}</p>
                          <button onClick={() => dispatch(addItem(item))} className="text-lg w-6 h-6 flex items-center justify-center bg-primary/20 rounded-sm">+</button>
                        </div>
                        <div className="col-span-2 text-right">
                          <button onClick={() => dispatch(removeItem(item.id))} className="text-red-500 hover:text-red-400 text-base">지우기</button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* total price display */}
                  <div className="mt-2 text-right text-sm font-bold">
                    합계: {cartItems.reduce((sum, itm) => sum + parseFloat(itm.price.replace(/,/g, '')) * itm.quantity, 0)} CR
                  </div>

                  <div className="mt-4 pt-4 border-t border-primary/30 flex justify-end gap-4">
                    <button className="bg-primary hover:bg-text-main text-main font-black py-2 px-4 text-xs uppercase tracking-widest">
                      구매하기
                    </button>
                <button className="bg-primary hover:bg-text-main text-main font-black py-2 px-4 text-xs uppercase tracking-widest">
                      선물하기
                    </button>
                  </div>
                </>
              )}
            </HUDBox>
          )}
        </div>
      </main>
    </div>
  );
};

export default Shop;
