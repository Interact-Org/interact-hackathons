import { Plus } from '@phosphor-icons/react';
import React from 'react';

interface Props {
  show?: boolean;
  onClick?: () => void;
}

const NewButton = ({ show = true, onClick }: Props) => {
  return (
    <button
      onClick={onClick}
      className={`fixed bottom-5 max-md:bottom-[110px] right-5 max-md:right-[10px] z-10 ${
        show ? 'opacity-100' : 'opacity-0'
      } hover:scale-105 transition-ease-500 cursor-pointer`}
    >
      <div className="relative flex-center gap-2 text-white glassMorphism rounded-lg shadow-2xl p-4 group">
        Create a New Project
        <Plus size={20} weight="bold" />
        <div className="w-full h-full bg-transparent absolute rotating-border-mask group-hover:opacity-5 opacity-10 animate-pulse top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 rounded-lg -z-10 transition-ease-300"></div>
      </div>
    </button>
  );
};

export default NewButton;
