/* eslint-disable no-unused-vars */
import { useState } from 'react';
import itemsData from '../../components/data/items.js';

const rarityColors = {
  common: 'from-gray-500/20 to-gray-600/20 border-gray-500/50',
  uncommon: 'from-green-500/20 to-green-600/20 border-green-500/50',
  rare: 'from-blue-500/20 to-blue-600/20 border-blue-500/50',
  epic: 'from-purple-500/20 to-purple-600/20 border-purple-500/50',
  legendary: 'from-cyan-500/20 to-cyan-600/20 border-cyan-500/50',
};

const rarityGlow = {
  common: 'shadow-[0_0_10px_rgba(156,163,175,0.3)]',
  uncommon: 'shadow-[0_0_10px_rgba(34,197,94,0.4)]',
  rare: 'shadow-[0_0_10px_rgba(59,130,246,0.4)]',
  epic: 'shadow-[0_0_10px_rgba(168,85,247,0.4)]',
  legendary: 'shadow-[0_0_15px_rgba(34,211,238,0.5)]',
};


// 샘플 아이템 데이터
const sampleItems = Object.values(itemsData);

export default function Inventory() {
  const [items, setItems] = useState(() => {
    const slots = Array(24).fill(null);
    slots[0] = sampleItems[0];
    slots[2] = sampleItems[1];
    slots[7] = sampleItems[2];
    slots[10] = sampleItems[3];
    slots[15] = sampleItems[4];
    slots[20] = sampleItems[5];
    return slots;
  });

  const [selectedSlot, setSelectedSlot] = useState(null);

  const handleSlotClick = (index) => {
    setSelectedSlot(selectedSlot === index ? null : index);
  };

  return (
    <div className="relative min-h-[400px] min-w-[400px] max-w-md p-8 bg-gradient-to-br from-cyan-950/40 to-cyan-900/20 border border-cyan-500/30 rounded-lg backdrop-blur-sm">
      {/* Cyber grid background */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(cyan 1px, transparent 1px), linear-gradient(90deg, cyan 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      ></div>

        {/* Header */}
        <div className="mb-4 pb-4 border-b border-cyan-500/30">
          <div className="flex items-center justify-between">
            <h2 className="text-cyan-300 tracking-wide font-medium">
              INVENTORY
            </h2>
            <div className="flex items-center gap-2 text-xs text-cyan-400/60">
              <span className="tracking-wider">
                {items.filter((i) => i !== null).length}/24
              </span>
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-6 gap-3">
          {items.map((item, index) => {
            const isSelected = selectedSlot === index;

            return (
              <button
                key={index}
                onClick={() => handleSlotClick(index)}
                className={`
                  relative rounded-lg border transition-all duration-300
                  ${
                    item
                      ? `bg-gradient-to-br ${rarityColors[item.rarity]} ${
                          isSelected ? rarityGlow[item.rarity] : ''
                        } hover:${rarityGlow[item.rarity]}`
                      : 'bg-cyan-950/20 border-cyan-500/20 hover:border-cyan-500/40'
                  }
                  ${isSelected ? 'scale-95 ring-2 ring-cyan-400' : ''}
                `}
                style={{ width: '64px', height: '64px' }}
              >
                {!item && (
                  <div className="absolute top-1 left-1 text-[10px] text-cyan-500/20">
                    {index + 1}
                  </div>
                )}

                {item && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-bold text-white">{item.name.charAt(0)}</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Item Details */}
        {selectedSlot !== null && items[selectedSlot] && (
          <div className="mt-6 pt-4 border-t border-cyan-500/30">
            <h3 className="text-cyan-300 font-medium mb-3 tracking-wide">
              ITEM DETAILS
            </h3>
            <div className="bg-gradient-to-br from-cyan-950/40 to-cyan-900/20 border border-cyan-500/30 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-start gap-4">
                <div
                  className={`w-16 h-16 rounded-lg border flex items-center justify-center text-lg font-bold text-white bg-gradient-to-br ${rarityColors[items[selectedSlot].rarity]}`}
                >
                  {items[selectedSlot].name.charAt(0)}
                </div>
                <div className="flex-1">
                  <h4 className="text-cyan-200 font-medium text-lg mb-1">
                    {items[selectedSlot].name}
                  </h4>
                  <div className="text-cyan-400/70 text-sm capitalize mb-3">
                    {items[selectedSlot].rarity}
                  </div>
                  <p className="text-cyan-100 text-sm leading-relaxed">
                    {items[selectedSlot].description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

    </div>
  );
}
