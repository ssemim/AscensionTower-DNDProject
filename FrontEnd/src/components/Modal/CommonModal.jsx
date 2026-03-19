import React from 'react';
import { useTheme } from '../ThemeProvider/ThemeProvider';

const CommonModal = ({ isOpen, onClose, children }) => {
  const { isDark } = useTheme();

  if (!isOpen) {
    return null;
  }

  const contentClasses = isDark
    ? 'bg-gray-800 text-white'
    : 'bg-white text-black';

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className={`relative p-5 rounded-lg w-[90vw] h-[90vh] ${contentClasses}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-2 text-2xl leading-none hover:text-gray-500"
          onClick={onClose}
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default CommonModal;
