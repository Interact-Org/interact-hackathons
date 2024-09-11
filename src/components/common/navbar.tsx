import { Bell, ChatCircleDots, Handshake, MagnifyingGlass } from '@phosphor-icons/react';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { ReactSVG } from 'react-svg';
import Image from 'next/image';
import { USER_PROFILE_PIC_URL } from '@/config/routes';
import { userSelector } from '@/slices/userSlice';
import ProfileDropdown from '@/sections/navbar/profile_dropdown';
import Link from 'next/link';

const Navbar = () => {
  const user = useSelector(userSelector);
  const [clickedOnProfile, setClickedOnProfile] = useState(false);
  return (
    <>
      <div className={`${clickedOnProfile ? '' : 'hidden'}`}>
        <ProfileDropdown setShow={setClickedOnProfile} />
      </div>
      <div className="w-full h-12 md:h-navbar bg-navbar dark:bg-dark_navbar text-gray-500 dark:text-white border-gray-300 border-b-[1px] dark:border-0 glassMorphism backdrop-blur-sm fixed top-0 flex justify-between px-4 items-center z-20">
        <Link href={'/'} className="hidden dark:flex">
          <ReactSVG src="/onboarding_logo_dark.svg" />
        </Link>
        <Link href={'/'} className="static dark:hidden ">
          <ReactSVG src="/onboarding_logo.svg" className="scale-75 md:scale-100 relative -left-4 md:left-0" />
        </Link>
        {user.id && (
          <div className="flex items-center gap-2 max-md:gap-0 z-0">
            <Image
              crossOrigin="anonymous"
              className="w-9 h-9 max-md:w-6 max-md:h-6 max-md:ml-2 rounded-full cursor-pointer"
              width={50}
              height={50}
              onClick={() => {
                setClickedOnProfile(prev => !prev);
              }}
              alt="user"
              src={`${USER_PROFILE_PIC_URL}/${user.profilePic != '' ? user.profilePic : 'default.jpg'}`}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default Navbar;
