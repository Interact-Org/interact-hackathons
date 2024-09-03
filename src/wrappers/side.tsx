import React, { ReactNode } from 'react';

interface WrapperProps {
  children: ReactNode;
}

const SideWrapper: React.FC<WrapperProps> = ({ children }) => {
  return (
    <div className="w-sidebar_open h-screen backdrop-blur-sm bg-sidebar dark:bg-dark_sidebar pt-navbar sticky top-0 py-6 flex flex-col gap-2 max-md:hidden">
      {children}
    </div>
  );
};

export default SideWrapper;
