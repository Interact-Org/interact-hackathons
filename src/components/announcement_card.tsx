import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import { Announcement } from '@/types';
import { USER_PROFILE_PIC_URL, ORG_URL, FRONTEND_URL } from '@/config/routes';
import moment from 'moment';
import { useSelector } from 'react-redux';
import deleteHandler from '@/handlers/delete_handler';
import Toaster from '@/utils/toaster';
import patchHandler from '@/handlers/patch_handler';
import { SERVER_ERROR } from '@/config/errors';
import ConfirmDelete from './common/confirm_delete';
import renderContentWithLinks from '@/utils/funcs/render_content_with_links';
import { checkParticularOrgAccess } from '@/utils/funcs/access';
import { ORG_SENIOR } from '@/config/constants';
import isArrEdited from '@/utils/funcs/check_array_edited';
import Link from 'next/link';
import { currentHackathonSelector } from '@/slices/hackathonSlice';
import { getHackathonRole } from '@/utils/funcs/hackathons';

interface Props {
  announcement: Announcement;
  setAnnouncements?: React.Dispatch<React.SetStateAction<Announcement[]>>;
}

const AnnouncementCard = ({ announcement, setAnnouncements }: Props) => {
  const [clickedOnOptions, setClickedOnOptions] = useState(false);
  const [clickedOnEdit, setClickedOnEdit] = useState(false);
  const [clickedOnDelete, setClickedOnDelete] = useState(false);

  const [title, setTitle] = useState(announcement.title);
  const [caption, setCaption] = useState(announcement.content);

  const hackathon = useSelector(currentHackathonSelector);

  const handleDelete = async () => {
    const toaster = Toaster.startLoad('Deleting your Announcement...');

    const URL = `${ORG_URL}/${hackathon.organizationID}/hackathons/announcements/${announcement.id}`;

    const res = await deleteHandler(URL);

    if (res.statusCode === 204) {
      if (setAnnouncements) setAnnouncements(prev => prev.filter(a => a.id != announcement.id));
      setClickedOnDelete(false);
      Toaster.stopLoad(toaster, 'Announcement Deleted', 1);
    } else {
      if (res.data.message) Toaster.stopLoad(toaster, res.data.message, 0);
      else Toaster.stopLoad(toaster, SERVER_ERROR, 0);
    }
  };

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
    const selectedText = caption.substring(start, end);
    const newText = caption.substring(0, start) + prefix + selectedText + suffix + caption.substring(end);
    setCaption(newText);
    textarea.focus();
    textarea.setSelectionRange(start + prefix.length, end + prefix.length);
  };

  const role = useMemo(() => getHackathonRole(), []);

  const handleEdit = async () => {
    if (caption == announcement.content || caption.trim().length == 0 || caption.replace(/\n/g, '').length == 0) {
      setClickedOnEdit(false);
      return;
    }
    const toaster = Toaster.startLoad('Editing Announcement...');

    const URL = `${ORG_URL}/${hackathon.organizationID}/hackathons/announcements/${announcement.id}`;

    const taggedUsers = (announcement.taggedUsers || []).map(u => u.username);
    const newTags = (caption.match(/@([\w-]+)/g) || []).map(match => match.substring(1));

    const formData = new FormData();
    formData.append('title', title.trim());
    formData.append('content', caption.replace(/\n{3,}/g, '\n\n'));
    if (isArrEdited(taggedUsers, newTags)) newTags.forEach(tag => formData.append('taggedUsernames[]', tag));

    const res = await patchHandler(URL, formData);
    if (res.statusCode === 200) {
      if (setAnnouncements)
        setAnnouncements(prev =>
          prev.map(a => {
            if (a.id == announcement.id) return { ...a, title, content: caption.replace(/\n{3,}/g, '\n\n'), edited: true };
            else return a;
          })
        );
      setClickedOnEdit(false);
      Toaster.stopLoad(toaster, 'Announcement Edited', 1);
    } else {
      if (res.data.message) Toaster.stopLoad(toaster, res.data.message, 0);
      else Toaster.stopLoad(toaster, SERVER_ERROR, 0);
    }
  };

  return (
    <>
      {clickedOnDelete && <ConfirmDelete setShow={setClickedOnDelete} handleDelete={handleDelete} />}
      <div
        onClick={() => setClickedOnOptions(false)}
        className="w-full h-fit relative overflow-clip bg-white font-primary flex gap-1 rounded-lg border-gray-300 border-[1px] dark:border-b-[1px] p-4 shadow-md animate-fade_third"
      >
        {clickedOnOptions && !clickedOnEdit && (
          <div className="w-1/4 h-fit flex flex-col bg-gray-100 bg-opacity-75 dark:bg-transparent absolute top-12 right-2 rounded-xl glassMorphism text-xs p-1 z-10 animate-fade_third">
            {checkParticularOrgAccess(ORG_SENIOR, announcement.hackathon?.organization || null) && (
              <div
                onClick={() => setClickedOnEdit(true)}
                className="w-full px-4 py-2 max-md:p-1 max-md:text-center hover:bg-[#ffffff] dark:hover:bg-[#ffffff19] transition-ease-100 rounded-lg cursor-pointer"
              >
                Edit
              </div>
            )}
            {checkParticularOrgAccess(ORG_SENIOR, announcement.hackathon?.organization || null) && (
              <div
                onClick={el => {
                  el.stopPropagation();
                  setClickedOnDelete(true);
                }}
                className="w-full px-4 py-2 max-md:p-1 max-md:text-center hover:bg-[#ffffff] dark:hover:bg-[#ffffff19] hover:text-primary_danger transition-ease-100 rounded-lg cursor-pointer"
              >
                Delete
              </div>
            )}
          </div>
        )}
        <Link
          href={`${FRONTEND_URL}/explore/organisation/${announcement.hackathon?.organization?.user.username}`}
          target="_blank"
          className="h-fit flex items-center gap-2"
        >
          <Image
            crossOrigin="anonymous"
            width={100}
            height={100}
            alt={'User Pic'}
            src={`${USER_PROFILE_PIC_URL}/${announcement.hackathon?.organization?.user.profilePic}`}
            placeholder="blur"
            blurDataURL={announcement.hackathon?.organization?.user.profilePicBlurHash || 'no-hash'}
            className="rounded-full w-8 h-8"
          />
        </Link>

        <div className="w-[calc(100%-32px)] flex flex-col gap-2">
          <div className="w-full h-fit flex justify-between">
            <Link
              href={`${FRONTEND_URL}/explore/organisation/${announcement.hackathon?.organization?.user.username}`}
              target="_blank"
              className="flex max-md:flex-col md:items-center gap-2 max-md:gap-0 font-medium"
            >
              {announcement.hackathon?.organization?.user.name}
              <div className="text-xs max-md:text-xxs font-normal text-gray-500">@{announcement.hackathon?.organization?.user.username}</div>{' '}
            </Link>
            <div className="flex-center gap-2 text-xs text-gray-400">
              {announcement.isEdited ? <div>(edited)</div> : <></>}
              <div>{moment(announcement.createdAt).fromNow()}</div>

              {!clickedOnEdit && role == 'org' && (
                <div
                  onClick={el => {
                    el.stopPropagation();
                    setClickedOnOptions(prev => !prev);
                  }}
                  className="text-xxs cursor-pointer"
                >
                  •••
                </div>
              )}
            </div>
          </div>

          {clickedOnEdit ? (
            <div className="relative flex flex-col gap-2">
              <input
                type="text"
                value={title}
                maxLength={50}
                onChange={el => setTitle(el.target.value)}
                className="w-full text-lg font-medium border-[2px] border-dashed p-2 rounded-lg focus:outline-none"
                placeholder="Announcement Title (Optional)"
              />
              <textarea
                id="textarea_id"
                maxLength={1000}
                value={caption}
                autoFocus={true}
                onChange={el => setCaption(el.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full text-sm border-[2px] border-dashed p-2 rounded-lg dark:text-white dark:bg-dark_primary_comp focus:outline-none min-h-[16rem] max-h-64 max-md:w-full"
              />

              <div className="dark:text-white flex items-center justify-end gap-4 max-md:gap-1">
                <div
                  onClick={() => setClickedOnEdit(false)}
                  className="border-[1px] border-primary_black flex-center rounded-full w-20 max-md:w-12 max-md:text-xxs p-1 cursor-pointer"
                >
                  cancel
                </div>
                {caption == announcement.content ? (
                  <div className="bg-primary_black bg-opacity-50 text-white flex-center rounded-full w-16 max-md:w-12 max-md:text-xxs p-1 cursor-default">
                    save
                  </div>
                ) : (
                  <div
                    onClick={handleEdit}
                    className="bg-primary_black text-white flex-center rounded-full w-16 max-md:w-12 max-md:text-xxs p-1 cursor-pointer"
                  >
                    save
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="w-full flex flex-col gap-2">
              <div className="text-lg font-medium">{announcement.title}</div>
              <div className="text-sm whitespace-pre-wrap">{renderContentWithLinks(announcement.content, announcement.taggedUsers)}</div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AnnouncementCard;
