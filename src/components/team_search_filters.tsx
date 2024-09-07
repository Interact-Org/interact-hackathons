import React, { useState } from 'react';
import { CalendarBlank, MagnifyingGlass, Newspaper, User } from '@phosphor-icons/react';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Calendar from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const TeamSearchFilters = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedAuthor, setSelectedAuthor] = useState<string | undefined>();
  const [selectedTrack, setSelectedTrack] = useState<string | undefined>();

  return (
    <div className="--filters flex items-center gap-2">
      {/* ----CREATED_AT FILTER------- */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant={'outline'} className={cn('min-w-fit w-32 pl-3 text-left font-normal border-[2px] border-[#dedede] h-10')}>
            <span>{selectedDate ? selectedDate.toDateString() : 'Created At'}</span>
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            disabled={date => date > new Date() || date < new Date('1900-01-01')}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      {/* ----AUTHOR FILTER------- */}
      <Select value={selectedAuthor} onValueChange={setSelectedAuthor}>
        <SelectTrigger className="w-32 min-w-fit bg-white h-10 border-[2px] border-[#dedede]">
          <User size={16} />
          <SelectValue placeholder="Author" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Keshav Aneja">Keshav Aneja</SelectItem>
          <SelectItem value="Pratham Mishra">Pratham Mishra</SelectItem>
          <SelectItem value="Aryan Bharti">Aryan Bharti</SelectItem>
        </SelectContent>
      </Select>

      {/* ----TRACK FILTER------- */}
      <Select value={selectedTrack} onValueChange={setSelectedTrack}>
        <SelectTrigger className="w-32 min-w-fit bg-white h-10 border-[2px] border-[#dedede]">
          <Newspaper size={16} />
          <SelectValue placeholder="Track" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Sustainable Development">Sustainable Development</SelectItem>
          <SelectItem value="FinTech">FinTech</SelectItem>
          <SelectItem value="EdTech">EdTech</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default TeamSearchFilters;
