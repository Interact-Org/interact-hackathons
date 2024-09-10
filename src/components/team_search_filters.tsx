import React from 'react';
import { MagnifyingGlass, Newspaper } from '@phosphor-icons/react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from './ui/input';

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
  return (
    <section className="--search-filters flex flex-col md:flex-row items-center md:justify-between gap-4">
      <div className="--search-box w-full flex-grow relative h-8 md:h-10">
        <Input
          className="bg-white border-[2px] border-[#dedede] focus-visible:border-primary_text ring-0 focus-visible:ring-0 pl-10 h-10"
          placeholder="Search"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <MagnifyingGlass size={16} className="absolute top-1/2 -translate-y-1/2 left-4" />
      </div>
      <div className="--filters flex flex-wrap lg:flex-nowrap items-center gap-[2%] md:gap-2">
        <Select value={track} onValueChange={setTrack}>
          <SelectTrigger className="w-[49%] md:w-32 min-w-fit bg-white h-10 border-[2px] border-[#dedede]">
            <Newspaper size={16} />
            <SelectValue placeholder="Track" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Sustainable Development">Sustainable Development</SelectItem>
            <SelectItem value="FinTech">FinTech</SelectItem>
            <SelectItem value="EdTech">EdTech</SelectItem>
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

        <div className="flex items-center gap-2 w-[49%] md:w-fit mt-2 md:mt-0">
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
        </div>

        <div className="flex items-center gap-2 w-[49%] md:w-fit mt-2 md:mt-0">
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
