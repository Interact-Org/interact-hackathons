import React from 'react';
import Image from 'next/image';
import { UserCircle } from '@phosphor-icons/react';
interface Props {
  image?: string;
  name?: string;
  size?: 'big' | 'small';
}
export const AvatarBox = ({ image, name, size = 'small' }: Props) => {
  const sizeClass = size === 'big' ? 'w-20 md:w-24 h-20 md:h-24' : 'w-8 h-8';
  return (
    <div
      className={`${sizeClass} rounded-full border-[1px] border-[#aeaeae] p-[2px] flex items-center justify-center relative group cursor-pointer `}
    >
      {image ? (
        <Image src={image} alt={name ?? ''} width={300} height={300} />
      ) : (
        <UserCircle size={36} weight="fill" className="text-primary_black/30 w-full h-full" />
      )}
      {name && (
        <span className="bg-primary_text text-white font-medium text-xs rounded-md absolute left-1/2 -translate-x-1/2 top-9 hidden group-hover:block px-3 py-1 text-nowrap ">
          {name}
        </span>
      )}
    </div>
  );
};
