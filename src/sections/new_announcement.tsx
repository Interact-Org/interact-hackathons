import { SERVER_ERROR } from '@/config/errors';
import { EXPLORE_URL, ORG_URL, USER_PROFILE_PIC_URL } from '@/config/routes';
import postHandler from '@/handlers/post_handler';
import Toaster from '@/utils/toaster';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { Announcement, User } from '@/types';
import { currentOrgIDSelector } from '@/slices/orgSlice';
import getHandler from '@/handlers/get_handler';
import TagUserUtils from '@/utils/funcs/tag_users';
import { currentHackathonSelector } from '@/slices/hackathonSlice';
import Input from '@/components/form/input';
import TextArea from '@/components/form/textarea';

interface Props {
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  setAnnouncements?: React.Dispatch<React.SetStateAction<Announcement[]>>;
}

const NewAnnouncement = ({ setShow, setAnnouncements }: Props) => {
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [isOpen, setIsOpen] = useState(true);
  const [taggedUsernames, setTaggedUsernames] = useState<string[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [showUsers, setShowUsers] = useState(false);
  const [cursorPosition, setCursorPosition] = useState<number | null>(null);

  useEffect(() => {
    document.documentElement.style.overflowY = 'hidden';
    document.documentElement.style.height = '100vh';

    return () => {
      document.documentElement.style.overflowY = 'auto';
      document.documentElement.style.height = 'auto';
    };
  }, []);

  const fetchUsers = async (search: string) => {
    const URL = `${EXPLORE_URL}/users/trending?search=${search}&limit=${10}`;
    const res = await getHandler(URL);
    if (res.statusCode == 200) {
      setUsers(res.data.users || []);
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

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'b' && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      wrapSelectedText('**', '**');
    }
  };

  const wrapSelectedText = (prefix: string, suffix: string) => {
    const textarea = document.getElementById('textarea_id') as HTMLTextAreaElement;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const newText = content.substring(0, start) + prefix + selectedText + suffix + content.substring(end);
    setContent(newText);
    textarea.focus();
    textarea.setSelectionRange(start + prefix.length, end + prefix.length);
  };

  const hackathon = useSelector(currentHackathonSelector);

  const handleSubmit = async () => {
    if (title.trim() == '') {
      Toaster.error('Title cannot be empty!');
      return;
    }
    if (content.trim() == '' || content.replace(/\n/g, '').length == 0) {
      Toaster.error('Caption cannot be empty!');
      return;
    }

    const toaster = Toaster.startLoad('Adding your Announcement..');

    const formData = {
      title,
      content: content.replace(/\n{3,}/g, '\n\n'),
      isOpen,
      taggedUsernames,
    };

    const URL = `${ORG_URL}/${hackathon.organizationID}/hackathons/announcements`;

    const res = await postHandler(URL, formData);
    if (res.statusCode === 201) {
      setContent('');
      setShow(false);
      const announcement: Announcement = res.data.announcement;
      if (setAnnouncements) setAnnouncements(prev => [announcement, ...prev]);
      Toaster.stopLoad(toaster, 'Announcement Added!', 1);
      setShow(false);
    } else {
      if (res.data.message) {
        Toaster.stopLoad(toaster, res.data.message, 0);
      } else {
        Toaster.stopLoad(toaster, SERVER_ERROR, 0);
      }
    }
  };

  return (
    <>
      <div className="fixed top-1/2 -translate-y-1/2 max-md:top-[calc(50%-75px)] w-1/2 max-lg:w-5/6 h-3/5 max-md:h-4/5 shadow-2xl dark:shadow-none backdrop-blur-xl bg-[#ffffff] dark:bg-[#ffe1fc22] flex flex-col gap-8 justify-between max-md:items-end p-8 max-md:p-6 dark:text-white font-primary overflow-y-auto border-[1px] border-primary_btn  dark:border-dark_primary_btn rounded-lg right-1/2 translate-x-1/2 max-md:-translate-y-1/2 animate-fade_third z-30">
        <div className="flex gap-4 max-md:w-full">
          {/* <Image
            crossOrigin="anonymous"
            className="w-16 h-16 rounded-full"
            width={50}
            height={50}
            alt="user"
            src={`${USER_PROFILE_PIC_URL}/${organisation.user.profilePic}`}
          /> */}
          <div className="grow flex flex-col gap-4">
            <div className="w-full flex flex-col gap-4 relative">
              <Input val={title} setVal={setTitle} label="Announcement Title" maxLength={50} />
              <div>
                <div className="text-xs ml-1 font-medium uppercase text-gray-500">
                  Announcement Content * ({content.trim().length}/{1000})
                </div>
                <textarea
                  id="textarea_id"
                  className="w-full min-h-[240px] max-h-80 bg-transparent focus:outline-none border-[1px] border-gray-400 rounded-lg p-2"
                  value={content}
                  onChange={tagsUserUtils.handleContentChange}
                  onKeyDown={handleKeyDown}
                  maxLength={1000}
                  placeholder="What's the announcement?"
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        {showUsers && users.length > 0 && (
          <div className="w-full pl-16 flex flex-wrap justify-center gap-4">
            {users.map(user => (
              <div
                key={user.id}
                onClick={() => tagsUserUtils.handleTagUser(user.username)}
                className="w-1/4 hover:scale-105 flex items-center gap-2 rounded-md border-[1px] border-primary_btn p-2 hover:bg-primary_comp cursor-pointer transition-ease-300"
              >
                <Image
                  crossOrigin="anonymous"
                  width={50}
                  height={50}
                  alt={'User Pic'}
                  src={`${USER_PROFILE_PIC_URL}/${user.profilePic}`}
                  className="rounded-full w-12 h-12"
                />
                <div className="">
                  <div className="text-sm font-semibold line-clamp-1">{user.name}</div>
                  <div className="text-xs text-gray-500">@{user.username}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="w-full flex justify-end items-center">
          {/* <div className="flex flex-col">
                <div className="text-2xl font-semibold">{organisation.user.name}</div>
                <div className="text-sm">@{organisation.user.username}</div>
              </div> */}
          <div
            onClick={handleSubmit}
            className="max-md:hidden w-[120px] h-[48px] bg-primary_comp dark:bg-dark_primary_comp hover:bg-primary_comp_hover dark:hover:bg-dark_primary_comp_hover active:bg-primary_comp_active dark:active:bg-dark_primary_comp_active transition-ease-300 shrink-0 flex-center text-lg font-semibold rounded-lg cursor-pointer"
          >
            Post
          </div>
        </div>
      </div>
      <div onClick={() => setShow(false)} className="bg-backdrop w-screen h-screen fixed top-0 left-0 animate-fade_third z-20"></div>
    </>
  );
};

export default NewAnnouncement;
