import { SERVER_ERROR } from '@/config/errors';
import { EVENT_PIC_URL } from '@/config/routes';
import getHandler from '@/handlers/get_handler';
import { setCurrentHackathon } from '@/slices/hackathonSlice';
import { Hackathon, HackathonRound } from '@/types';
import {
  getHackathonStage,
  HACKATHON_COMPLETED,
  HACKATHON_LIVE,
  HACKATHON_NOT_STARTED,
  HACKATHON_TEAM_ENDED,
  HACKATHON_TEAM_REGISTRATION,
} from '@/utils/funcs/hackathons';
import Toaster from '@/utils/toaster';
import { Users } from '@phosphor-icons/react';
import moment from 'moment';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React from 'react';
import { useDispatch } from 'react-redux';

interface Props {
  hackathon: Hackathon;
  isAdmin?: boolean;
}

const HackathonCard = ({ hackathon, isAdmin = false }: Props) => {
  const router = useRouter();

  const getCurrentRound = async () => {
    const URL = `/hackathons/${hackathon.id}/participants/round`;
    const res = await getHandler(URL, undefined, true);
    if (res.statusCode == 200) {
      return [res.data.round, res.data.nextRound];
    } else {
      Toaster.error(res.data.message || SERVER_ERROR);
    }
  };

  const buildURL = (currentRound: HackathonRound, nextRound: HackathonRound) => {
    let URL = '';
    if (isAdmin) URL += 'admin';
    else URL += 'participant';
    switch (getHackathonStage(hackathon, true, currentRound, nextRound)) {
      case HACKATHON_NOT_STARTED:
        URL = '#';
        break;
      case HACKATHON_TEAM_REGISTRATION:
        if (isAdmin) URL += '/teams';
        else URL += '/team';
        break;
      case HACKATHON_TEAM_ENDED:
        URL += `/stage`;
        break;
      case HACKATHON_LIVE:
        URL += `/live`;
        break;
      case HACKATHON_COMPLETED:
        URL += `/ended`;
        break;
    }
    return URL;
  };

  const dispatch = useDispatch();

  const handleClick = async () => {
    dispatch(setCurrentHackathon(hackathon));
    const [currentRound, nextRound] = (await getCurrentRound()) || [undefined, undefined];
    router.push(buildURL(currentRound, nextRound));
  };

  return (
    <div
      onClick={handleClick}
      className="w-full rounded-xl hover:shadow-xl transition-ease-out-500 animate-fade_third border-[2px] border-[#dedede] cursor-pointer"
    >
      <div className="w-full relative group">
        <div className="flex gap-1 top-2 right-2 absolute bg-white text-gray-500 text-xxs px-2 py-1 rounded-lg">
          <Users size={12} /> <div>{hackathon.noParticipants}</div>
        </div>

        <Image
          width={200}
          height={200}
          src={`${EVENT_PIC_URL}/${hackathon.coverPic}`}
          alt=""
          className="w-full h-32 md:h-44 object-cover rounded-t-xl"
          placeholder="blur"
          blurDataURL={hackathon.blurHash || 'no-hash'}
        />
        <div className="absolute bottom-2 right-2 bg-white text-gray-500 text-xxs px-2 py-1 rounded-lg">{hackathon.organization.title}</div>
        <div className="absolute top-2 left-2 bg-green-500 text-white text-xxs px-2 py-1 rounded-lg">{getHackathonStage(hackathon)}</div>
        <div className="absolute top-10 left-2 bg-white text-gray-500 text-xxs px-2 py-1 rounded-lg">{hackathon.location}</div>
      </div>

      <div className="w-full h-16 md:h-20 bg-white rounded-b-xl flex p-2 md:p-4">
        <div className="w-1/6 flex items-start justify-start mt-1">
          <div className="w-fit flex flex-col items-center md:items-end">
            <div className="w-fit text-xs uppercase transition-ease-out-500">{moment(hackathon.startTime).format('MMM')}</div>
            <div className="w-fit text-xl md:text-3xl font-semibold transition-ease-out-500">{moment(hackathon.startTime).format('DD')}</div>
          </div>
        </div>

        <div className="w-5/6 h-16 md:h-20 flex flex-col transition-ease-out-500">
          <div className="font-medium text-base md:text-lg line-clamp-1">{hackathon.title}</div>
          <div className="text-xs md:text-sm text-gray-500 line-clamp-2 transition-ease-out-500">{hackathon.tagline}</div>
        </div>
      </div>
    </div>
  );
};

export default HackathonCard;
