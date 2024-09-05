import React from 'react';

interface Props {
  label: string;
  onClick?: () => void;
  animateIn?: boolean;
  disabled?: boolean;
  width?: string;
  textSize?: string;
}

const PrimaryButton = ({ label, onClick, animateIn = true, disabled, width = '32', textSize = 'lg' }: Props) => {
  const variants = ['w-32', 'w-40', 'w-fit', 'text-lg', 'text-base', 'text-sm'];
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`w-${width} text-${textSize} text-center font-medium px-4 py-2 border-[1px] border-primary_comp_hover bg-primary_comp hover:bg-primary_comp_hover active:bg-primary_comp_active text-primary_text transition-ease-500 rounded-lg cursor-pointer ${
        animateIn && 'animate-fade_third'
      } disabled:opacity-50 disabled:hover:bg-primary_comp disabled:cursor-default`}
    >
      {label}
    </button>
  );
};

export default PrimaryButton;
