import { SERVER_ERROR } from '@/config/errors';
import { EXPLORE_URL, USER_PROFILE_PIC_URL } from '@/config/routes';
import getHandler from '@/handlers/get_handler';
import { userSelector } from '@/slices/userSlice';
import { User } from '@/types';
import TagUserUtils from '@/utils/funcs/tag_users';
import Toaster from '@/utils/toaster';
import Image from 'next/image';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

interface Props {
  content: string;
  setContent: React.Dispatch<React.SetStateAction<string>>;
  handleSubmit: () => void;
  type: string;
  taggedUsernames: string[];
  setTaggedUsernames: React.Dispatch<React.SetStateAction<string[]>>;
  userFetchURL?: string;
}

const CommentInput = ({
  content,
  setContent,
  taggedUsernames,
  setTaggedUsernames,
  handleSubmit,
  type,
  userFetchURL,
}: Props) => {
  const [users, setUsers] = useState<User[]>([]);
  const [showUsers, setShowUsers] = useState(false);
  const [cursorPosition, setCursorPosition] = useState<number | null>(null);

  const user = useSelector(userSelector);

  const fetchUsers = async (search: string) => {
    const URL = (userFetchURL ? userFetchURL : `${EXPLORE_URL}/users/trending`) + `?search=${search}&limit=${10}`;
    const res = await getHandler(URL);
    if (res.statusCode == 200) {
      const userData: User[] = res.data.users || [];
      setUsers(userData.filter(u => u.id != user.id));
    } else {
      if (res.data.message) Toaster.error(res.data.message, 'error_toaster');
      else Toaster.error(SERVER_ERROR, 'error_toaster');
    }
  };

  const tagsUserUtils = new TagUserUtils(
    cursorPosition,
    content,
    showUsers,
    taggedUsernames,
    setCursorPosition,
    setContent,
    fetchUsers,
    setShowUsers,
    setTaggedUsernames
  );

  return (
    <div className="relative">
      <div className="w-full flex gap-2">
        <Image
          crossOrigin="anonymous"
          className={`${type == 'comment' ? 'w-6 h-6' : 'w-8 h-8'} rounded-full cursor-default mt-2`}
          width={50}
          height={50}
          alt="user"
          src={`${USER_PROFILE_PIC_URL}/${user.profilePic}`}
        />
        <div className="w-full flex justify-between gap-3 max-md:flex-col relative max-md:gap-2 max-md:items-end">
          <textarea
            value={content}
            onChange={tagsUserUtils.handleContentChange}
            onKeyDown={el => {
              if (el.key === 'Enter') handleSubmit();
            }}
            className={`w-5/6 ${
              type == 'comment' ? 'text-sm' : 'max-md:text-sm'
            } border-[1px] border-dashed p-2 rounded-lg dark:text-white dark:bg-dark_primary_comp focus:outline-none min-h-[3rem] max-h-64 max-md:w-full`}
            placeholder={`${type == 'comment' ? 'Reply to' : 'Comment on'} this ${type}`}
          />
          <div
            className={`w-1/6 h-fit ${
              type == 'comment' ? 'text-xs' : 'text-sm max-md:text-xs'
            } dark:bg-dark_primary_comp hover:bg-primary_comp_hover active:bg-primary_comp_active dark:hover:bg-dark_primary_comp_hover dark:active:bg-dark_primary_comp_active font-medium border-[1px] border-primary_btn  dark:border-dark_primary_btn rounded-md py-2 px-3  flex-center cursor-pointer max-md:h-10 max-md:w-fit transition-ease-300`}
            onClick={handleSubmit}
          >
            {type == 'comment' ? 'Reply' : 'Comment'}
          </div>
        </div>
      </div>
      {showUsers && users.length > 0 && (
        <div
          className={`w-full absolute bg-gradient-to-b ${
            type == 'task' ? 'from-gray-50 via-[#ffffffca]' : 'from-white via-[#ffffffb2]'
          } via-[90%] flex flex-wrap justify-center gap-2 py-4 z-10`}
        >
          {users.map(user => (
            <div
              key={user.id}
              onClick={() => tagsUserUtils.handleTagUser(user.username)}
              className="w-1/3 hover:scale-105 flex items-center gap-1 rounded-md border-[1px] border-primary_btn p-2 hover:bg-primary_comp cursor-pointer transition-ease-300"
            >
              <Image
                crossOrigin="anonymous"
                width={50}
                height={50}
                alt={'User Pic'}
                src={`${USER_PROFILE_PIC_URL}/${user.profilePic}`}
                className="rounded-full w-6 h-6"
              />
              <div className="flex-center gap-2">
                <div className="text-sm font-semibold line-clamp-1">{user.name}</div>
                <div className="text-xs text-gray-500">@{user.username}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentInput;
