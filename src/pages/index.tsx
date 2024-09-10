import HackathonCard from '@/components/hackathon_card';
import { Button } from '@/components/ui/button';
import { SERVER_ERROR } from '@/config/errors';
import getHandler from '@/handlers/get_handler';
import useUserStateSynchronizer from '@/hooks/sync';
import { Hackathon } from '@/types';
import Toaster from '@/utils/toaster';
import Protect from '@/utils/wrappers/protect';
import { SignOut } from '@phosphor-icons/react';
import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';

const Index = () => {
  const [registeredHackathons, setRegisteredHackathons] = useState<Hackathon[]>([]);
  const [adminHackathons, setAdminHackathons] = useState<Hackathon[]>([]);
  const [orgHackathons, setOrgHackathons] = useState<Hackathon[]>([]);

  const fetchHackathons = async (URL: string, setter: React.Dispatch<React.SetStateAction<Hackathon[]>>) => {
    const res = await getHandler(URL);
    if (res.statusCode == 200) {
      setter(res.data.hackathons || []);
    } else {
      if (res.data.message) Toaster.error(res.data.message);
      else Toaster.error(SERVER_ERROR);
    }
  };

  const userStateSynchronizer = useUserStateSynchronizer();

  useEffect(() => {
    fetchHackathons('/hackathons/me', setRegisteredHackathons);
    fetchHackathons('/hackathons/admin/me', setAdminHackathons);
    fetchHackathons('/hackathons/org/me', setOrgHackathons);
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const action = urlParams.get('action');

    if (action == 'sync') userStateSynchronizer(); //TODO remove form params after promise is successful
  }, [window.location.search]);
  function handleLogout() {
    Cookies.remove('token');
    Cookies.remove('refresh_token');
    Cookies.remove('id');
  }
  return (
    <div className="w-full bg-[#E1F1FF] min-h-screen">
      <header className="bg-primary_text text-white w-full py-1 px-4 font-semibold">Interact</header>
      <div className="w-full bg-white  h-fit py-2 text-primary_text flex items-center  justify-between px-4">
        <span className="flex flex-col">
          <h1 className="text-2xl font-semibold">Hackathon Dashboard</h1>
          <p className="text-xs text-black/60">Manage all your hackathons from here</p>
        </span>
        <Button className=" px-8 gap-3" variant={'outline'} onClick={handleLogout}>
          <p>Logout</p>
          <SignOut size={16} />
        </Button>
      </div>
      <div className="w-[95%] mx-auto h-full flex flex-col gap-8 py-8">
        <div className="w-full flex flex-col gap-8 p-4">
          <div className="w-full flex flex-col gap-0">
            <div className="text-xl px-4 py-1 rounded-t-xl font-medium bg-white text-primary_text w-fit">Registered Hackathons</div>
            <div className="w-full grid grid-cols-4 gap-4 bg-white p-3 rounded-xl rounded-tl-none">
              {registeredHackathons.map(hackathon => (
                <HackathonCard key={hackathon.id} hackathon={hackathon} />
              ))}
            </div>
          </div>
          {adminHackathons && adminHackathons.length > 0 && (
            <div className="w-full flex flex-col gap-2">
              <div className="text-xl px-4 py-1 rounded-t-xl font-medium bg-white text-primary_text w-fit">Admin Hackathons</div>
              <div className="w-full grid grid-cols-4 gap-4 bg-white p-3 rounded-xl rounded-tl-none">
                {adminHackathons.map(hackathon => (
                  <HackathonCard key={hackathon.id} hackathon={hackathon} isAdmin={true} />
                ))}
              </div>
            </div>
          )}
          {orgHackathons && orgHackathons.length > 0 && (
            <div className="w-full flex flex-col gap-2">
              <div className="text-xl px-4 py-1 rounded-t-xl font-medium bg-white text-primary_text w-fit">Org Hackathons</div>
              <div className="w-full grid grid-cols-4 gap-4 bg-white p-3 rounded-xl rounded-tl-none">
                {orgHackathons.map(hackathon => (
                  <HackathonCard key={hackathon.id} hackathon={hackathon} isAdmin={true} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Protect(Index);
