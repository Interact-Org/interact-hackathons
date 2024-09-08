import { USER_PROFILE_PIC_URL } from '@/config/routes';
import { User } from '@/types';
import ModalWrapper from '@/wrappers/modal';
import Image from 'next/image';
import React from 'react';

interface Props {
  users: User[];
  title: string;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}

const UsersList = ({ users, title, setShow }: Props) => {
  return (
    <ModalWrapper setShow={setShow} width={'1/3'} top={'1/3'}>
      <div className="text-2xl font-semibold">
        {title} ({users.length})
      </div>
      <div className="w-full flex flex-col gap-2">
        {users.map(user => (
          <div
            key={user.id}
            className="w-full h-12 px-4 bg-white rounded-xl border-gray-400 flex text-sm text-primary_black transition-ease-300"
          >
            <div className="w-full flex items-center gap-1">
              <Image
                crossOrigin="anonymous"
                width={50}
                height={50}
                alt={'User Pic'}
                src={`${USER_PROFILE_PIC_URL}/${user.profilePic}`}
                placeholder="blur"
                blurDataURL={user.profilePicBlurHash || 'no-hash'}
                className="w-8 h-8 rounded-full z-[1]"
              />
              <div className="flex-center gap-2">
                <div className="font-medium text-lg">{user.name}</div>
                <div className="text-xs">@{user.username}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ModalWrapper>
  );
};

export default UsersList;
