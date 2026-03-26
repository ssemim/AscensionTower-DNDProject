export default function ReceiveAndUseModal({ title, onConfirm, onClose, confirmText, from, itemName, quantity, description }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-main border border-border-primary rounded-xl p-8 max-w-sm w-full shadow-stark-glow relative">
        <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
        <h3 className="text-primary font-bold text-lg tracking-widest mb-4">{title}</h3>
        {from && (
          <p className="text-text-main/70 text-sm font-one-store-mobile-gothic-body mb-1">from: <span className="text-primary">{from}</span></p>
        )}
        {itemName && (
          <p className="text-text-main/70 text-sm font-one-store-mobile-gothic-body mb-1">
            item: <span className="text-primary">{itemName}</span> {quantity && `x${quantity}`}
          </p>
        )}
        {description && (
          <p className="text-text-main/50 text-xs font-one-store-mobile-gothic-body mt-3 border-t border-border-primary/30 pt-3">
            "{description}"
          </p>
        )}
        <div className="flex gap-3 mt-6">
          <button onClick={onConfirm} className="flex-1 bg-primary hover:bg-primary/80 text-white font-bold py-2 rounded-lg transition-colors tracking-widest text-sm">{confirmText}</button>
          <button onClick={onClose} className="flex-1 border border-border-primary/50 text-text-main/50 hover:text-text-main font-bold py-2 rounded-lg transition-colors text-sm">CLOSE</button>
        </div>
      </div>
    </div>
  );
}
