import { MagnifyingGlass } from '@phosphor-icons/react';
import React, { useState } from 'react';

const Search = () => {
  const [search, setSearch] = useState('');
  return (
    <div className="w-40 h-fit px-2 py-1 flex items-center gap-2 text-white bg-primary_black rounded-lg">
      <MagnifyingGlass className="cursor-pointer" size={20} />
      <input
        value={search}
        onChange={el => setSearch(el.target.value)}
        maxLength={25}
        type="text"
        className="w-full font-medium bg-transparent focus:outline-none"
      />
    </div>
  );
};

export default Search;
