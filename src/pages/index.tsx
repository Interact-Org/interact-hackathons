import HackathonCard from '@/components/hackathon_card';
import { Button } from '@/components/ui/button';
import { SERVER_ERROR } from '@/config/errors';
import getHandler from '@/handlers/get_handler';
import useUserStateSynchronizer from '@/hooks/sync';
import { userSelector } from '@/slices/userSlice';
import { Hackathon } from '@/types';
import Toaster from '@/utils/toaster';
import Protect from '@/utils/wrappers/protect';
import BaseWrapper from '@/wrappers/base';
import { SignOut } from '@phosphor-icons/react';
import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const Index = () => {
  const [registeredHackathons, setRegisteredHackathons] = useState<Hackathon[]>([]);
  const [adminHackathons, setAdminHackathons] = useState<Hackathon[]>([]);
  const [orgHackathons, setOrgHackathons] = useState<Hackathon[]>([]);

  const fetchHackathons = async (URL: string, setter: React.Dispatch<React.SetStateAction<Hackathon[]>>) => {
    const res = await getHandler(URL);
    if (res.statusCode == 200) {
      setter(res.data.hackathons || []);
    } else {
      Toaster.error(res.data.message || SERVER_ERROR);
    }
  };

  const userStateSynchronizer = useUserStateSynchronizer();

  const user = useSelector(userSelector);

  useEffect(() => {
    fetchHackathons('/hackathons/me', setRegisteredHackathons);
    fetchHackathons('/hackathons/admin/me', setAdminHackathons);
    fetchHackathons('/hackathons/org/me', setOrgHackathons);
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const action = urlParams.get('action');

    if (action == 'sync') userStateSynchronizer(); //TODO remove form params after promise is successful
    else {
      if (user.registeredEvents?.length == 0 && user.organizationMemberships?.length == 0) userStateSynchronizer();
    }
  }, [window.location.search]);

  function handleLogout() {
    Cookies.remove('token');
    Cookies.remove('refresh_token');
    Cookies.remove('id');
    window.location.replace('/login');
  }
  return (
    <BaseWrapper>
      <div className="w-full bg-[#E1F1FF] min-h-base">
        <div className="w-full bg-white h-fit py-2 text-primary_text flex items-center  justify-between px-4">
          <span className="flex flex-col">
            <h1 className="text-xl md:text-2xl font-semibold">Hackathon Dashboard</h1>
            <p className="text-xs text-black/60">Manage all your hackathons from here</p>
          </span>
          <Button className="px-4 md:px-8 gap-3" variant={'outline'} onClick={handleLogout}>
            <p className="hidden md:inline-block">Logout</p>
            <SignOut size={16} />
          </Button>
        </div>
        <div className="w-full md:w-[95%] mx-auto h-full flex flex-col gap-8 py-8">
          <div className="w-full flex flex-col gap-8 p-4">
            {registeredHackathons && registeredHackathons.length > 0 && (
              <div className="w-full flex flex-col">
                <div className="text-lg md:text-xl px-4 py-1 rounded-t-xl font-medium bg-white text-primary_text w-fit">Registered Hackathons</div>
                <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-white p-3 rounded-xl rounded-tl-none">
                  {registeredHackathons.map(hackathon => (
                    <HackathonCard key={hackathon.id} hackathon={hackathon} />
                  ))}
                </div>
              </div>
            )}
            {adminHackathons && adminHackathons.length > 0 && (
              <div className="w-full flex flex-col">
                <div className="text-lg md:text-xl px-4 py-1 rounded-t-xl font-medium bg-white text-primary_text w-fit">Admin Hackathons</div>
                <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-white p-3 rounded-xl rounded-tl-none">
                  {adminHackathons.map(hackathon => (
                    <HackathonCard key={hackathon.id} hackathon={hackathon} isAdmin={true} />
                  ))}
                </div>
              </div>
            )}
            {orgHackathons && orgHackathons.length > 0 && (
              <div className="w-full flex flex-col">
                <div className="text-lg md:text-xl px-4 py-1 rounded-t-xl font-medium bg-white text-primary_text w-fit">Org Hackathons</div>
                <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-white p-3 rounded-xl rounded-tl-none">
                  {orgHackathons.map(hackathon => (
                    <HackathonCard key={hackathon.id} hackathon={hackathon} isAdmin={true} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </BaseWrapper>
  );
};

export default Protect(Index);
