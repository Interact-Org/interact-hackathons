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
  isEliminated: boolean;
  setIsEliminated: (value: boolean) => void;
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
  isEliminated,
  setIsEliminated,
  overallScore,
  setOverallScore,
  order,
  setOrder,
}) => {
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

  return (
    <section className="--search-filters flex items-center justify-between gap-4">
      <div className="--search-box w-full flex-grow relative h-10">
        <Input
          className="bg-white border-[2px] border-[#dedede] focus-visible:border-primary_text ring-0 focus-visible:ring-0 pl-10 h-10"
          placeholder="Search"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <MagnifyingGlass size={16} className="absolute top-1/2 -translate-y-1/2 left-4" />
      </div>
      <div className="--filters flex items-center gap-2">
        <Select value={track} onValueChange={setTrack}>
          <SelectTrigger className="w-32 min-w-fit bg-white h-10 border-[2px] border-[#dedede]">
            <Newspaper size={16} />
            <SelectValue placeholder="Track" />
          </SelectTrigger>
          <SelectContent>
            {tracks?.map(track => (
              <SelectItem key={track.id} value={track.title}>
                {track.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={order} onValueChange={setOrder}>
          <SelectTrigger className="w-32 min-w-fit bg-white h-10 border-[2px] border-[#dedede]">
            <SelectValue placeholder="Sort Order" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="latest">Latest</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2">
          <label htmlFor="overall-score" className="text-sm">
            Score
          </label>
          <input
            id="overall-score"
            type="number"
            value={overallScore}
            onChange={e => setOverallScore(Number(e.target.value))}
            className="w-20 h-10 border-[2px] border-[#dedede] text-center"
          />
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="elimination-checkbox" className="text-sm">
            Eliminated
          </label>
          <input
            id="elimination-checkbox"
            type="checkbox"
            checked={isEliminated}
            onChange={() => setIsEliminated(!isEliminated)}
            className="w-4 h-4 border-gray-300 rounded focus:ring-primary_text"
          />
        </div>
      </div>
    </section>
  );
};

export default TeamSearchFilters;
