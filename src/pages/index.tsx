import HackathonCard from '@/components/hackathon_card';
import { SERVER_ERROR } from '@/config/errors';
import getHandler from '@/handlers/get_handler';
import useUserStateSynchronizer from '@/hooks/sync';
import { Hackathon } from '@/types';
import Toaster from '@/utils/toaster';
import Protect from '@/utils/wrappers/protect';
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

  return (
    <div className="w-full flex flex-col gap-8 p-4">
      <div className="w-full flex flex-col gap-2">
        <div className="text-2xl font-medium">Registered Hackathons</div>
        <div className="w-full flex flex-wrap gap-8">
          {registeredHackathons.map(hackathon => (
            <HackathonCard key={hackathon.id} hackathon={hackathon} />
          ))}
        </div>
      </div>
      <div className="w-full flex flex-col gap-2">
        <div className="text-2xl font-medium">Admin Hackathons</div>
        <div className="w-full flex flex-wrap gap-8">
          {adminHackathons.map(hackathon => (
            <HackathonCard key={hackathon.id} hackathon={hackathon} isAdmin={true} />
          ))}
        </div>
      </div>
      <div className="w-full flex flex-col gap-2">
        <div className="text-2xl font-medium">Org Hackathons</div>
        <div className="w-full flex flex-wrap gap-8">
          {orgHackathons.map(hackathon => (
            <HackathonCard key={hackathon.id} hackathon={hackathon} isAdmin={true} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Protect(Index);
