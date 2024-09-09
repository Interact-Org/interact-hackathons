import React, { useEffect, useState } from 'react';

interface Props {
  tags: string[];
  limit?: number;
  center?: boolean;
  displayAll?: boolean;
}

const Tags = ({ tags, limit = 20, center = false, displayAll = false }: Props) => {
  const [displayTags, setDisplayTags] = useState<string[]>([]);
  useEffect(() => {
    if (displayAll) setDisplayTags(tags || []);
    else
      setDisplayTags(
        (tags || []).filter(tag => {
          if (limit - tag.length < 0) return false;
          limit -= tag.length;
          return true;
        })
      );
  }, [tags, limit]);

  return (
    <div className={`w-full flex flex-wrap ${center && 'justify-center'} gap-1`}>
      {displayTags &&
        displayTags.map(tag => {
          return (
            <div
              key={tag}
              className="flex-center px-2 py-1 font-primary text-xs dark:text-white border-[1px] border-primary_btn  dark:border-dark_primary_btn rounded-lg"
            >
              {tag}
            </div>
          );
        })}
      {!displayAll && tags.length - displayTags.length > 0 && (
        <div className="flex-center px-2 py-1 font-primary text-xs dark:text-white border-[1px] border-primary_btn  dark:border-dark_primary_btn rounded-lg">
          +{tags.length - displayTags.length}
        </div>
      )}
    </div>
  );
};

export default Tags;
