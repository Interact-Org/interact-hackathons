import React, { useEffect, useState } from 'react';
import { Announcement } from '@/types';
import getHandler from '@/handlers/get_handler';
import Toaster from '@/utils/toaster';
import { SERVER_ERROR } from '@/config/errors';
import { useSelector } from 'react-redux';
import { currentHackathonSelector } from '@/slices/hackathonSlice';
import AnnouncementCard from '@/components/announcement_card';

interface Props {
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}

const ViewAnnouncements = ({ setShow }: Props) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    document.documentElement.style.overflowY = 'hidden';
    document.documentElement.style.height = '100vh';

    return () => {
      document.documentElement.style.overflowY = 'auto';
      document.documentElement.style.height = 'auto';
    };
  }, []);

  const hackathon = useSelector(currentHackathonSelector);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      const res = await getHandler(`/org/${hackathon.organizationID}/hackathons/${hackathon.id}/announcements/`);
      if (res.statusCode == 200) {
        setAnnouncements(res.data.announcements);
        console.log(res.data.announcements);
      } else {
        if (res.data.message) Toaster.error(res.data.message);
        else Toaster.error(SERVER_ERROR);
      }
    };

    fetchAnnouncements();
  }, []);

  return (
    <>
      <div className="fixed top-1/2 -translate-y-1/2 max-md:top-[calc(50%-75px)] w-1/2 max-lg:w-5/6 h-fit max-h-[75%] shadow-2xl dark:shadow-none backdrop-blur-xl bg-[#ffffff] dark:bg-[#ffe1fc22] flex flex-col gap-8 justify-between max-md:items-end p-8 max-md:p-6 dark:text-white font-primary overflow-y-auto border-[1px] border-primary_btn  dark:border-dark_primary_btn rounded-lg right-1/2 translate-x-1/2 max-md:-translate-y-1/2 animate-fade_third z-30">
        {announcements && announcements.length > 0 ? (
          <div className="w-full flex flex-col gap-4">
            {announcements.map(announcement => (
              <AnnouncementCard key={announcement.id} announcement={announcement} setAnnouncements={setAnnouncements} />
            ))}
          </div>
        ) : (
          <div className="mx-auto font-medium text-lg">No Announcements yet</div>
        )}
      </div>
      <div onClick={() => setShow(false)} className="bg-backdrop w-screen h-screen fixed top-0 left-0 animate-fade_third z-20"></div>
    </>
  );
};

export default ViewAnnouncements;
