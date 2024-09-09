import React from 'react';

const CommentsLoader = () => {
  return (
    <div className="w-full flex flex-col gap-4">
      {Array(4)
        .fill(1)
        .map((_, index) => (
          <div key={index} className="flex flex-col gap-2">
            <div className="w-full flex justify-between items-center">
              <div className="flex gap-2">
                <div className="animate-pulse w-8 h-8 bg-primary_comp dark:bg-dark_primary_comp_hover rounded-full cursor-pointer" />
                <div className="flex flex-col gap-1">
                  <div className="animate-pulse w-32 h-5 bg-primary_comp dark:bg-dark_primary_comp_hover rounded-md" />
                  <div className="animate-pulse w-12 h-3 bg-primary_comp dark:bg-dark_primary_comp_hover rounded-md" />
                </div>
              </div>
            </div>
            <div className="pl-10">
              <div className="animate-pulse w-full h-12 bg-primary_comp dark:bg-dark_primary_comp_hover rounded-lg" />
            </div>
          </div>
        ))}
    </div>
  );
};

export default CommentsLoader;
