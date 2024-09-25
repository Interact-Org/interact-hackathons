import React from 'react';
import LinksField from '../utils/edit_links';

interface Props {
  label?: string;
  links: string[];
  setLinks: React.Dispatch<React.SetStateAction<string[]>>;
  maxLinks: number;
  required?: boolean;
}

const Links = ({ label, links, setLinks, maxLinks, required = false }: Props) => {
  return (
    <div className="w-full">
      {label && (
        <div className="flex items-center justify-between">
          <div className="text-xs ml-1 font-medium uppercase text-gray-500">
            {label}
            {required && '*'} ({links.length}/{maxLinks})
          </div>
          <div className="text-xs ml-1 font-medium text-gray-500">Press &apos;Enter&apos; to confirm</div>
        </div>
      )}
      <LinksField links={links} setLinks={setLinks} maxLinks={maxLinks} />
    </div>
  );
};

export default Links;
