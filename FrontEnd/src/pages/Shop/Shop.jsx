import Inventory from '../../components/Inventory/Inventory';
// import { useState } from 'react';

export default function Shop() {
  return (
    <div className="grid h-screen w-screen overflow-hidden">
      <main className="flex-1 overflow-auto relative px-2 top-0 left-0">
        <div className="max-w-full mx-auto">

          <h1>상...점...</h1>


          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <Inventory />

            <div className="flex-1">
              <div className="bg-gradient-to-br from-cyan-950/40 to-cyan-900/20 border border-cyan-500/30 rounded-lg min-w-[400px] p-6 backdrop-blur-sm">
                <h2 className="text-cyan-300 mb-4 tracking-wide">
                  장바구니 
                </h2>
                <p className="text-cyan-100/60 text-sm">
                  뭔가 골라담아야해욥
                </p>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
