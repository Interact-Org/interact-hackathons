import { User } from '@/types';
import React from 'react';
import Image from 'next/image';
import { USER_PROFILE_PIC_URL } from '@/config/routes';

interface Props {
  users: User[];
  size?: number;
}

const PictureList = ({ users, size = 4 }: Props) => {
  return users?.length > 0 ? (
    <div className="flex gap-2">
      {users.map((u, index) => {
        return (
          <Image
            key={index}
            crossOrigin="anonymous"
            width={50}
            height={50}
            alt={'User Pic'}
            src={`${USER_PROFILE_PIC_URL}/${u.profilePic}`}
            style={{ width: size * 4, height: size * 4 }}
            placeholder="blur"
            blurDataURL={u.profilePicBlurHash || 'no-hash'}
            className="rounded-full cursor-default shadow-md"
          />
        );
      })}
    </div>
  ) : (
    <></>
  );
};

export default PictureList;
