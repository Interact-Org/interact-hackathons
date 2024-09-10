import Navbar from '@/components/common/navbar';
import Head from 'next/head';
import React, { ReactNode } from 'react';

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
      <div className="w-full flex pt-12 md:pt-navbar">{children}</div>
    </>
  );
};

export default BaseWrapper;
