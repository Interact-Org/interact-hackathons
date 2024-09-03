import React, { ReactNode } from 'react';

interface WrapperProps {
  children: ReactNode;
}

const MainWrapper: React.FC<WrapperProps> = ({ children }) => {
  return (
    <>
      <div className="w-[calc(100vw-100px)] ml-[100px] mt-navbar max-lg:w-screen max-lg:ml-0 max-lg:pb-bottomBar transition-ease-out-500">
        <div className="bg-white h-[0px] dark:h-[1px] w-full sticky top-16 z-10"></div>
        <div className="bg-main dark:bg-dark_main h-base w-full fixed top-16 backdrop-blur-md -z-10"></div>
        {children}
      </div>
    </>
  );
};

export default MainWrapper;
