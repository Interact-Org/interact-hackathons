import Navbar from '@/components/common/navbar';
import Head from 'next/head';
import React, { ReactNode } from 'react';
import { ReactSVG } from 'react-svg';

interface WrapperProps {
  title?: string;
  children: ReactNode;
}

const BaseWrapper: React.FC<WrapperProps> = ({ children, title = '' }) => {
  return (
    <>
      <Head>
        <title>{title} | Interact</title>
      </Head>
      <Navbar />
      <div className="w-full flex">{children}</div>
      {/* <ReactSVG className="w-screen h-screen hidden dark:block fixed -z-50 top-0 right-0" src="/assets/base.svg" /> */}
      {/* <div className="w-screen h-screen main_bg fixed -z-50 top-0 right-0"></div> */}
    </>
  );
};

export default BaseWrapper;
