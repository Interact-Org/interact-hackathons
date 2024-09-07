import { EVENT_PIC_URL } from '@/config/routes';
import { Hackathon } from '@/types';
import { getHackathonStage, HACKATHON_COMPLETED, HACKATHON_LIVE, HACKATHON_NOT_STARTED, HACKATHON_TEAM_REGISTRATION } from '@/utils/funcs/hackathons';
import { Users } from '@phosphor-icons/react';
import moment from 'moment';
import Image from 'next/image';
import Link from 'next/link';
import React, { useMemo } from 'react';

interface Props {
  hackathon: Hackathon;
  isAdmin?: boolean;
}

const HackathonCard = ({ hackathon, isAdmin = false }: Props) => {
  const URL = useMemo(() => {
    const hackathonStage = getHackathonStage(hackathon);
    let URL = '';
    if (isAdmin) URL += 'admin';
    else URL += 'participant';

    switch (hackathonStage) {
      case HACKATHON_NOT_STARTED:
        URL = '#';
        break;
      case HACKATHON_TEAM_REGISTRATION:
        if (isAdmin) URL += '/teams';
        else URL += '/team';
        URL += `?hid=${hackathon.id}`;
        break;
      case HACKATHON_LIVE:
        URL += `/live?hid=${hackathon.id}`;
        break;
      case HACKATHON_COMPLETED:
        URL += `/completed?hid=${hackathon.id}`;
        break;
    }

    return URL;
  }, [hackathon, isAdmin]);

  return (
    <Link href={URL} target={URL == '#' ? '_self' : '_blank'} className="w-96 rounded-xl hover:shadow-xl transition-ease-out-500 animate-fade_third">
      <div className="w-full relative group">
        <div className="flex gap-1 top-2 right-2 absolute bg-white text-gray-500 text-xxs px-2 py-1 rounded-lg">
          <Users size={12} /> <div>{hackathon.noParticipants}</div>
        </div>

        <Image
          width={200}
          height={200}
          src={`${EVENT_PIC_URL}/${hackathon.coverPic}`}
          alt=""
          className="w-full h-56 object-cover rounded-t-xl"
          placeholder="blur"
          blurDataURL={hackathon.blurHash || 'no-hash'}
        />
        <div className="absolute bottom-2 right-2 bg-white text-gray-500 text-xxs px-2 py-1 rounded-lg">{hackathon.organization.title}</div>
        <div className="absolute top-2 left-2 bg-green-500 text-white text-xxs px-2 py-1 rounded-lg">{getHackathonStage(hackathon)}</div>
        <div className="absolute top-10 left-2 bg-white text-gray-500 text-xxs px-2 py-1 rounded-lg">{hackathon.location}</div>
      </div>

      <div className="w-full h-20 bg-white rounded-b-xl flex p-4">
        <div className="w-1/6 flex items-start justify-start mt-1">
          <div className="w-fit flex flex-col items-end">
            <div className="w-fit text-xs uppercase transition-ease-out-500">{moment(hackathon.startTime).format('MMM')}</div>
            <div className="w-fit text-3xl font-semibold transition-ease-out-500">{moment(hackathon.startTime).format('DD')}</div>
          </div>
        </div>

        <div className="w-5/6 h-20 flex flex-col transition-ease-out-500">
          <div className="font-medium text-lg line-clamp-1">{hackathon.title}</div>
          <div className="text-sm text-gray-500 line-clamp-2 transition-ease-out-500">{hackathon.tagline}</div>
        </div>
      </div>
    </Link>
  );
};

export default HackathonCard;
