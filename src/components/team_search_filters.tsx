import React, { useEffect, useState } from 'react';
import { MagnifyingGlass, Newspaper } from '@phosphor-icons/react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from './ui/input';
import { HackathonTrack } from '@/types';
import getHandler from '@/handlers/get_handler';
import { useSelector } from 'react-redux';
import { currentHackathonSelector } from '@/slices/hackathonSlice';
import Toaster from '@/utils/toaster';
import { SERVER_ERROR } from '@/config/errors';

interface TeamSearchFiltersProps {
  search: string;
  setSearch: (value: string) => void;
  track: string;
  setTrack: (value: string) => void;
  eliminated: string;
  setEliminated: (value: string) => void;
  overallScore: number;
  setOverallScore: (value: number) => void;
  order: string;
  setOrder: (value: string) => void;
}

const TeamSearchFilters: React.FC<TeamSearchFiltersProps> = ({
  search,
  setSearch,
  track,
  setTrack,
  eliminated,
  setEliminated,
  overallScore,
  setOverallScore,
  order,
  setOrder,
}) => {
  const [tempSearch, setTempSearch] = useState(search);
  const [tracks, setTracks] = useState<HackathonTrack[]>([]);

  const hackathon = useSelector(currentHackathonSelector);

  const getTracks = async () => {
    const URL = `/hackathons/tracks/${hackathon.id}`;
    const res = await getHandler(URL);
    if (res.statusCode == 200) {
      setTracks(res.data.tracks);
    } else {
      if (res.data.message) Toaster.error(res.data.message);
      else Toaster.error(SERVER_ERROR);
    }
  };

  useEffect(() => {
    getTracks();
  }, []);

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setSearch(tempSearch);
    }
  };

  return (
    <section className="--search-filters flex flex-col md:flex-row items-center md:justify-between gap-4">
      <div className="--search-box w-full flex-grow relative h-8 md:h-10">
        <Input
          className="bg-white border-[2px] border-[#dedede] focus-visible:border-primary_text ring-0 focus-visible:ring-0 pl-10 h-10"
          placeholder="Search"
          value={tempSearch}
          onChange={el => setTempSearch(el.target.value)}
          onKeyUp={handleKeyUp}
        />
        <MagnifyingGlass size={16} className="absolute top-1/2 -translate-y-1/2 left-4" />
      </div>
      <div className="--filters flex flex-wrap lg:flex-nowrap items-center gap-[2%] md:gap-2">
        <Select value={track} onValueChange={setTrack}>
          <SelectTrigger className="w-[49%] md:w-32 min-w-fit bg-white h-10 border-[2px] border-[#dedede]">
            <Newspaper size={16} />
            <SelectValue placeholder="Tracks" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem key={-1} value={'none'}>
              All Tracks
            </SelectItem>
            {tracks?.map(track => (
              <SelectItem key={track.id} value={track.id}>
                {track.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={order} onValueChange={setOrder}>
          <SelectTrigger className="w-[49%] md:w-32 min-w-fit bg-white h-10 border-[2px] border-[#dedede]">
            <SelectValue placeholder="Sort Order" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="latest">Latest</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
          </SelectContent>
        </Select>

        {/* <div className="flex items-center gap-2">
          <label htmlFor="overall-score" className="text-sm">
            Score
          </label>
          <input
            id="overall-score"
            type="number"
            value={overallScore}
            onChange={e => setOverallScore(Number(e.target.value))}
            className="w-20 h-8 md:h-10 border-[2px] border-[#dedede] text-center"
          />
        </div> */}


        <Select value={eliminated} onValueChange={setEliminated}>
          <SelectTrigger className="w-[49%] md:w-32 min-w-fit bg-white h-10 border-[2px] border-[#dedede]">
            <SelectValue placeholder="Elimination Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">All</SelectItem>
            <SelectItem value="eliminated">Eliminated</SelectItem>
            <SelectItem value="not_eliminated">Not Eliminated</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </section>
  );
};

export default TeamSearchFilters;
