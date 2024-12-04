import React from 'react';
import { IoIosSearch } from "react-icons/io";
import { AiOutlineMenu } from "react-icons/ai"; // Icon for small screen menu
import { useZustand } from '../../Zustand/useZustand';

export const Navbar = () => {
  const {userInformation}=useZustand()
  return (
    <nav className="w-[98%] m-auto bg-white text-black p-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center">
    
        <h1 className="text-lg font-bold">Social Media App</h1>

        <div className="hidden md:flex w-[50%] h-auto relative mt-4 md:mt-0">
          <input
            type="text"
            placeholder="Search..."
            className="w-full sm:w-4/5 h-9 rounded-full text-black px-11 border-2 "
          />
          <button className="text-black h-9 rounded-full absolute left-4 top-1/2 -translate-y-1/2">
            <IoIosSearch size={20} />
          </button>
        </div>

        
        <div className="flex items-center">
          <img
            src={userInformation?.profilePicture}
            alt={`${userInformation?.username}'s Image`}
            className="w-12 h-12 rounded-full"
          />
          <span className="ml-4 text-sm font-medium">{userInformation?.username}</span>
         
          {/* <ul className="hidden md:flex flex-wrap gap-4 sm:gap-8 mt-4 sm:mt-0">
            <li className="hover:text-blue-500 transition-colors duration-300 cursor-pointer">
              Home
            </li>
            <li className="hover:text-blue-500 transition-colors duration-300 cursor-pointer">
              Profile
            </li>
            <li className="hover:text-blue-500 transition-colors duration-300 cursor-pointer">
              Logout
            </li>
          </ul> */}

          
          <button className="md:hidden text-black">
            <AiOutlineMenu size={24} />
          </button>
        </div>
      </div>
    </nav>
  );
};
